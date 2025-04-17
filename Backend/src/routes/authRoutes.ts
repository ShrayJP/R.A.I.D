import express from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = express.Router(); // ✅ Define the router

router.post("/register", async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

export default router;