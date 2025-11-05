import type { CorsOptions, CorsOptionsDelegate } from "cors";

import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "../.env" });
}

export const {
  EXPRESS_PORT = 3000,
  JWT_SECRET = "your_jwt_secret_must_be_at_least_32_characters_long_and_in_environment_variables",
  NODE_ENV = "development",
  ORIGIN_DOMAIN = "localhost",
} = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const PRODUCTION_ENV = NODE_ENV === "production";

export const SERVER_PORT =
  typeof EXPRESS_PORT === "number" ? EXPRESS_PORT : Number(EXPRESS_PORT);

export const COOKIE_OPTIONS = {
  domain: ORIGIN_DOMAIN,
  httpOnly: PRODUCTION_ENV ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: PRODUCTION_ENV ? "strict" : "lax",
  secure: PRODUCTION_ENV ? true : false,
} as const;

export const CORS_OPTIONS: CorsOptions | CorsOptionsDelegate | undefined = {
  allowedHeaders: ["Content-Type", "Cookie"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  optionsSuccessStatus: 200,
  origin:
    NODE_ENV === "production"
      ? "https://vods-to-cloud.strealr.live"
      : "http://localhost:5173",
};
