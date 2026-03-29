import type { APIRoute } from "astro";
import { clearAdminSessionCookieHeader } from "../../../server/adminSession";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const secure = new URL(request.url).protocol === "https:";

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin/tests",
      "Set-Cookie": clearAdminSessionCookieHeader(secure),
    },
  });
};
