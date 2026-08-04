import { Router } from "express";

import {
  signup,
  login,
  googleAuth,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import verifyToken from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// Email Auth
// =========================

router.post("/signup", signup);

router.post("/login", login);

// =========================
// Google Auth
// =========================

router.post("/google", googleAuth);

// =========================
// Current User
// =========================

router.get("/me", verifyToken, getCurrentUser);

export default router;