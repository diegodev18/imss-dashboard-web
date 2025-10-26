import express, { Router } from "express";

import { SERVER_PORT } from "@/config";

const app = express();

const router = Router();

router.get("/", (_req, res) => {
  res.send("Hello, World!");
});

app.use("/api", router);

app.listen(SERVER_PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log(
      `Server is running on http://localhost:${SERVER_PORT.toString()}`,
    );
  }
});
