import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";

import {
  CORS_OPTIONS,
  ORIGIN_DOMAIN,
  PRODUCTION_ENV,
  SERVER_PORT,
} from "@/config";
import { getSessionMiddleware } from "@/middlewares";
import authRouter from "@/routes/auth.route";
import botRouter from "@/routes/bot.route";
import employeesRouter from "@/routes/employees.route";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(getSessionMiddleware);
app.use(cors(CORS_OPTIONS));

const router = Router();

router.use("/auth", authRouter);
router.use("/employees", employeesRouter);
router.use("/bot", botRouter);

router.get("/", (_, r) => r.status(200).json({ message: "API is running." }));

app.use("/api", router);

app.listen(SERVER_PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    const portStr = SERVER_PORT.toString();
    const httpScheme = PRODUCTION_ENV ? "https" : "http";
    const url = `${httpScheme}://${ORIGIN_DOMAIN}${PRODUCTION_ENV ? "/api" : `:${portStr}`}`;
    console.info(`Server (backend) is running on ${url}.`);
  }
});
