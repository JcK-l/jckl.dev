import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE_NAME = "admin_dashboard_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

const signSessionValue = (value: string, secret: string) => {
  return createHmac("sha256", secret).update(value).digest("hex");
};

export const createAdminSessionValue = (
  secret: string,
  now = Date.now()
) => {
  const expiresAt = now + ADMIN_SESSION_TTL_SECONDS * 1000;
  const payload = String(expiresAt);
  const signature = signSessionValue(payload, secret);

  return `${payload}.${signature}`;
};

export const verifyAdminSessionValue = (
  value: string | null | undefined,
  secret: string,
  now = Date.now()
) => {
  if (!value || !secret) {
    return false;
  }

  const [payload, signature] = value.split(".");

  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = signSessionValue(payload, secret);

  if (signature.length !== expectedSignature.length) {
    return false;
  }

  if (
    !timingSafeEqual(
      Buffer.from(signature, "utf8"),
      Buffer.from(expectedSignature, "utf8")
    )
  ) {
    return false;
  }

  const expiresAt = Number.parseInt(payload, 10);

  return Number.isFinite(expiresAt) && expiresAt > now;
};

const buildCookieParts = ({
  maxAgeSeconds,
  secure,
  value,
}: {
  maxAgeSeconds: number;
  secure: boolean;
  value: string;
}) => {
  const parts = [
    `${ADMIN_SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "HttpOnly",
    "Path=/admin",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];

  if (secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
};

export const createAdminSessionCookieHeader = ({
  secret,
  secure,
}: {
  secret: string;
  secure: boolean;
}) => {
  return buildCookieParts({
    maxAgeSeconds: ADMIN_SESSION_TTL_SECONDS,
    secure,
    value: createAdminSessionValue(secret),
  });
};

export const clearAdminSessionCookieHeader = (secure: boolean) => {
  return buildCookieParts({
    maxAgeSeconds: 0,
    secure,
    value: "",
  });
};
