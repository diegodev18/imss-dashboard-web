import { Router } from "express";

import {
  createAuthToken,
  deleteSession,
  getSessions,
} from "@/controllers/bot.controller";

const router = Router();

router.get("/session/get", getSessions);
router.post("/session/create", createAuthToken);
router.delete("/session/delete/:authToken", deleteSession);

export default router;
