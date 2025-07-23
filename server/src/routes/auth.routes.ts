import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";
import { Request, Response } from "express";
import { CustomRequest } from "../types/auth.types";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/home", auth, function (req: Request, res: Response) {
  const { user } = req as CustomRequest;
  return res.json(user);
});

export default authRoutes;
