import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerUser);

export default authRoutes;
