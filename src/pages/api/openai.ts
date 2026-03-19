import type { APIRoute } from "astro";
import { handleContactSentimentRequest } from "../../server/contactSentiment";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const result = await handleContactSentimentRequest({
    apiKey: import.meta.env.OPENAI_API_KEY,
    body: await request.text(),
    method: request.method,
  });

  return new Response(result.body, {
    status: result.status,
    headers: result.headers,
  });
};
