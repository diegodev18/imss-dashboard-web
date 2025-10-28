import cookieParser from "cookie-parser";
import express, { Router } from "express";

import { SERVER_PORT } from "@/config";
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
    console.log(
      `Server is running on http://localhost:${SERVER_PORT.toString()}`
    );
  }
});
