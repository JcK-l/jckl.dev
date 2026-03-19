import type { Handler } from "@netlify/functions";
import { handleContactSentimentRequest } from "../../src/server/contactSentiment";

export const handler: Handler = async (event) => {
  const result = await handleContactSentimentRequest({
    apiKey: process.env.OPENAI_API_KEY,
    body: event.body,
    method: event.httpMethod,
  });

  return {
    statusCode: result.status,
    headers: result.headers,
    body: result.body,
  };
};
