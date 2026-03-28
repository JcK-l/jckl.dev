import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const apiMocks = vi.hoisted(() => ({
  handleContactSentimentRequest: vi.fn(),
}));

vi.mock("../../server/contactSentiment", () => ({
  handleContactSentimentRequest: apiMocks.handleContactSentimentRequest,
}));

import { POST, prerender } from "../../pages/api/openai";

describe("/api/openai", () => {
  beforeEach(() => {
    apiMocks.handleContactSentimentRequest.mockReset();
    vi.stubEnv("OPENAI_API_KEY", "openai-secret");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("disables prerendering and proxies the request through the sentiment handler", async () => {
    apiMocks.handleContactSentimentRequest.mockResolvedValue({
      body: JSON.stringify({ sentiment: "neutral" }),
      headers: {
        "content-type": "application/json",
        "x-test": "ok",
      },
      status: 202,
    });

    const request = new Request("https://example.com/api/openai", {
      body: JSON.stringify({ message: "hello" }),
      method: "POST",
    });

    const response = await POST({ request } as Parameters<typeof POST>[0]);

    expect(prerender).toBe(false);
    expect(apiMocks.handleContactSentimentRequest).toHaveBeenCalledWith({
      apiKey: "openai-secret",
      body: JSON.stringify({ message: "hello" }),
      method: "POST",
    });
    expect(response.status).toBe(202);
    expect(response.headers.get("x-test")).toBe("ok");
    expect(await response.text()).toBe(JSON.stringify({ sentiment: "neutral" }));
  });
});
