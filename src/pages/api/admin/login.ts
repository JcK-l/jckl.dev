import type { APIRoute } from "astro";
import { createAdminSessionCookieHeader } from "../../../server/adminSession";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const password = formData.get("password");
  const configuredPassword = import.meta.env.ADMIN_DASHBOARD_PASSWORD;
  const sessionSecret = import.meta.env.ADMIN_DASHBOARD_SECRET;
  const secure = new URL(request.url).protocol === "https:";

  if (!configuredPassword || !sessionSecret) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/tests?error=missing-config",
      },
    });
  }

  if (typeof password !== "string" || password !== configuredPassword) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/tests?error=invalid-password",
      },
    });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin/tests",
      "Set-Cookie": createAdminSessionCookieHeader({
        secret: sessionSecret,
        secure,
      }),
    },
  });
};
