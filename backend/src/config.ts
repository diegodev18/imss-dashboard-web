import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "../.env" });
}

export const {
  EXPRESS_PORT = 3000,
  JWT_SECRET = "your_jwt_secret_must_be_at_least_32_characters_long_and_in_environment_variables",
} = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const SERVER_PORT =
  typeof EXPRESS_PORT === "number" ? EXPRESS_PORT : Number(EXPRESS_PORT);

export const COOKIE_OPTIONS = {
  domain: "dukehomelab.site",
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "strict",
  secure: true,
} as const;
