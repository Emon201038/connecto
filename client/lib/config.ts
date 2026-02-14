const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  console.error("SESSION_SECRET environment variable is not set. Please create a .env.local file and add SESSION_SECRET with a 32-character string.");
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is not set in production environment.");
  }
}

export const SESSION_SECRET = sessionSecret || "a-super-secret-key-for-dev-only";
