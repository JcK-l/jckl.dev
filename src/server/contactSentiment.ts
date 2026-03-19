import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const jsonHeaders: Record<string, string> = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

const requestBodySchema = z.object({
  message: z.string().trim().min(1, "Message is required"),
});

const sentimentResponseSchema = z.object({
  sentiment: z.enum(["negative", "neutral", "positive"]),
});

export interface SentimentRequest {
  apiKey?: string;
  body: string | null | undefined;
  method?: string;
}

export interface SentimentResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

const getMessageByteLength = (message: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(message).length;
};

const buildResponse = (
  status: number,
  body: Record<string, unknown>,
  headers?: Record<string, string>
): SentimentResponse => ({
  status,
  headers: {
    ...jsonHeaders,
    ...headers,
  },
  body: JSON.stringify(body),
});

const parseRequestBody = (body: string | null | undefined) => {
  try {
    return requestBodySchema.parse(JSON.parse(body || "{}"));
  } catch {
    return null;
  }
};

export const handleContactSentimentRequest = async ({
  apiKey,
  body,
  method,
}: SentimentRequest): Promise<SentimentResponse> => {
  if (method && method !== "POST") {
    return buildResponse(
      405,
      { error: "Method not allowed" },
      { Allow: "POST" }
    );
  }

  if (!apiKey) {
    return buildResponse(500, { error: "API key is missing" });
  }

  const requestBody = parseRequestBody(body);

  if (!requestBody) {
    return buildResponse(400, { error: "A valid message is required" });
  }

  if (getMessageByteLength(requestBody.message) > 36) {
    return buildResponse(400, {
      error: "Message must be 36 bytes or less",
    });
  }

  const client = new OpenAI({ apiKey });

  try {
    const completion = await client.beta.chat.completions.parse({
      model: "gpt-5.4-nano",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "Classify the user's message sentiment. Return only the JSON object required by the schema. Choose 'negative' for hostile, rude, sad, angry, or clearly pessimistic messages. Choose 'neutral' for factual, mixed, or ambiguous messages. Choose 'positive' for friendly, grateful, excited, or optimistic messages.",
        },
        { role: "user", content: requestBody.message },
      ],
      response_format: zodResponseFormat(
        sentimentResponseSchema,
        "contact-sentiment"
      ),
    });

    const result = completion.choices[0]?.message?.parsed;

    if (!result) {
      throw new Error("OpenAI response did not match the expected schema");
    }

    return buildResponse(200, result);
  } catch (error) {
    console.error("OpenAI sentiment function failed", error);
    return buildResponse(500, { error: "Failed to analyze sentiment" });
  }
};
