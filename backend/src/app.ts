import cookieParser from "cookie-parser";
import express, { Router } from "express";

import { ORIGIN_DOMAIN, PRODUCTION_ENV, SERVER_PORT } from "@/config";
import authRouter from "@/routes/auth.route";

const app = express();

app.use(express.json());
app.use(cookieParser());

const router = Router();

router.use("/auth", authRouter);

app.use("/api", router);

app.listen(SERVER_PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    const portStr = SERVER_PORT.toString();
    const httpScheme = PRODUCTION_ENV ? "https" : "http";
    const url = `${httpScheme}://${ORIGIN_DOMAIN}:${portStr}`;
    console.info(`Server (backend) is running on ${url}.`);
  }
});
