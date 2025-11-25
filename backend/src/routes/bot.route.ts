import { Router } from "express";

import { createAuthToken, getSessions } from "@/controllers/bot.controller";

const router = Router();

router.get("/session/get", getSessions);
router.post("/session/create", createAuthToken);

export default router;
