import { Router } from "express";

import {
  getSession,
  login,
  logout,
  register,
} from "@/controllers/auth.controller";

const router = Router();

router.get("/session", getSession);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

export default router;
