import { beforeEach, describe, expect, it, vi } from "vitest";

const openAiMocks = vi.hoisted(() => {
  const parse = vi.fn();
  const OpenAI = vi.fn(function MockOpenAI() {
    return {
      beta: {
        chat: {
          completions: {
            parse,
          },
        },
      },
    };
  });
  const zodResponseFormat = vi.fn(() => "mock-response-format");

  return {
    OpenAI,
    parse,
    zodResponseFormat,
  };
});

vi.mock("openai", () => ({
  default: openAiMocks.OpenAI,
}));

vi.mock("openai/helpers/zod", () => ({
  zodResponseFormat: openAiMocks.zodResponseFormat,
}));

import { handleContactSentimentRequest, jsonHeaders } from "./contactSentiment";

const parseResponseBody = (body: string) => JSON.parse(body) as Record<string, unknown>;

describe("handleContactSentimentRequest", () => {
  beforeEach(() => {
    openAiMocks.OpenAI.mockClear();
    openAiMocks.parse.mockReset();
    openAiMocks.zodResponseFormat.mockClear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("rejects unsupported methods", async () => {
    const result = await handleContactSentimentRequest({
      apiKey: "secret",
      body: JSON.stringify({ message: "hello" }),
      method: "GET",
    });

    expect(result.status).toBe(405);
    expect(result.headers.Allow).toBe("POST");
    expect(result.headers["Content-Type"]).toBe(jsonHeaders["Content-Type"]);
    expect(parseResponseBody(result.body)).toEqual({ error: "Method not allowed" });
  });

  it("requires an API key and a valid short message", async () => {
    const missingKey = await handleContactSentimentRequest({
      body: JSON.stringify({ message: "hello" }),
      method: "POST",
    });
    const invalidBody = await handleContactSentimentRequest({
      apiKey: "secret",
      body: "not-json",
      method: "POST",
    });
    const tooLong = await handleContactSentimentRequest({
      apiKey: "secret",
      body: JSON.stringify({ message: "a".repeat(37) }),
      method: "POST",
    });

    expect(missingKey.status).toBe(500);
    expect(parseResponseBody(missingKey.body)).toEqual({
      error: "API key is missing",
    });

    expect(invalidBody.status).toBe(400);
    expect(parseResponseBody(invalidBody.body)).toEqual({
      error: "A valid message is required",
    });

    expect(tooLong.status).toBe(400);
    expect(parseResponseBody(tooLong.body)).toEqual({
      error: "Message must be 36 bytes or less",
    });
  });

  it("returns the parsed sentiment when OpenAI succeeds", async () => {
    openAiMocks.parse.mockResolvedValue({
      choices: [{ message: { parsed: { sentiment: "positive" } } }],
    });

    const result = await handleContactSentimentRequest({
      apiKey: "secret",
      body: JSON.stringify({ message: "Thanks for building this" }),
      method: "POST",
    });

    expect(result.status).toBe(200);
    expect(parseResponseBody(result.body)).toEqual({ sentiment: "positive" });
    expect(openAiMocks.OpenAI).toHaveBeenCalledWith({ apiKey: "secret" });
    expect(openAiMocks.parse).toHaveBeenCalledTimes(1);
    expect(openAiMocks.parse.mock.calls[0]?.[0]).toMatchObject({
      model: "gpt-5.4-nano",
      temperature: 0,
      response_format: "mock-response-format",
    });
  });

  it("returns a failure response when the OpenAI result is missing or invalid", async () => {
    openAiMocks.parse.mockResolvedValue({
      choices: [{ message: { parsed: null } }],
    });

    const result = await handleContactSentimentRequest({
      apiKey: "secret",
      body: JSON.stringify({ message: "Mixed feelings" }),
      method: "POST",
    });

    expect(result.status).toBe(500);
    expect(parseResponseBody(result.body)).toEqual({
      error: "Failed to analyze sentiment",
    });
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
