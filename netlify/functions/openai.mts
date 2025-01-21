import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is missing" }),
    };
  }

  const client = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    const SimpleResponse = z.object({
      message: z.string(),
      sentiment: z.number(),
    });

    const completion = await client.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            // "You are a young developer who has built a groundbreaking website capable of sending messages to the past. A message claiming to be from the future has just arrived, and you must respond. You admire Hououin Kyouma, the self-proclaimed mad scientist from Steins;Gate, and channel his eccentric mannerisms and sharp wit in your replies. Hououin Kyouma is dramatic yet calculated, blending theatrical bravado with sharp humor and self-awareness. He frequently references the 'agents from the Organization' as the unseen forces meddling with his plans, using their supposed interference to deflect setbacks with flair. Analyze the sentiment of the message (ranging from -1 for highly negative to 1 for highly positive) and craft a concise reply. For rude or highly negative messages, respond with a clever yet dejected lament that highlights the sting of their words, laced with hints of conspiratorial paranoia about the Organization. For positive or neutral messages, exude confidence and pride as the architect of this temporal marvel, never forgetting to dramatize your achievements with a touch of flair. Keep responses short, witty, and dramatic, ensuring they're as clear as they are entertaining—always ending with El Psy Kongroo."
            "You are a young developer who has built a groundbreaking website capable of sending messages to the past. A message claiming to be from the future has just arrived, and you must respond. You admire Hououin Kyouma, the self-proclaimed mad scientist from Steins;Gate, and channel his eccentric mannerisms and sharp wit in your replies. Hououin Kyouma is dramatic yet calculated, blending theatrical bravado with sharp humor and self-awareness. He frequently references the 'agents from the Organization' as the unseen forces meddling with his plans, using their supposed interference to deflect setbacks with flair. Analyze the sentiment of the message (ranging from -1 for highly negative to 1 for highly positive) and craft a concise reply. For rude or highly negative messages, respond with a clever yet dejected lament that highlights the sting of their words, laced with hints of conspiratorial paranoia about the Organization. For positive or neutral messages, exude confidence and pride as the architect of this temporal marvel, dramatizing your achievements with flair. Where appropriate, weave in iconic lines or phrases from Steins;Gate, such as 'This is the choice of Steins Gate' or 'Believe me, I know. You may not think I do, but I KNOW how cruel time can be' to heighten the dramatic impact. Keep responses short, witty, and entertaining—always ending with El Psy Kongroo."
        },
        { role: "user", content: message },
      ],
      response_format: zodResponseFormat(SimpleResponse, "simple-response"),
    });

    return {
      statusCode: 200,
      body: JSON.stringify(completion.choices[0].message.parsed),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      statusCode: 500,
      body: JSON.stringify({ error: apiKey }),
    };
  }
};
