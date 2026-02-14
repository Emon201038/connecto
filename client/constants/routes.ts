/**
 * those route do not require authentication
 * @type {string[]}
 */
export const PUBLIC_ROUTES = [
  "/sign-up",
  "/login",
  "/forgot-password",
  "/forgot-password/recover",
  "/forgot-password/recover/code",
  "/forgot-password/recover/code/new-password",
  "/reset-password",
  "/verify-email",
  "/2-factor-authentication",
  "/privacy-policy",
  "/contact-us",
];

/**
 * those route use for authentication
 * @type {string[]}
 */
export const AUTH_ROUTES = [
  "/sign-up",
  "/login",
  "/forgot-password",
  "/forgot-password/recover",
  "/forgot-password/recover/code",
  "/forgot-password/recover/code/new-password",
  "/reset-password",
  "/verify-email",
  "/2-factor-authentication",
];

/**
 * the prefix for api authentication routes
 * routes that starts with this prefix are used for api authentication purpose
 * @type {string}
 */
export const API_AUTH_PREFIX = "/api/auth";
