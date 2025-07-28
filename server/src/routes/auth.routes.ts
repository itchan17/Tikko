import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";
import { Request, Response } from "express";
import { validateRequest } from "../middleware/validateRequest";
import { RegistrationSchema, LoginSchema } from "../types/auth.types";

const authRoutes = Router();

authRoutes.post("/register", validateRequest(RegistrationSchema), register);
authRoutes.post("/login", validateRequest(LoginSchema), login);
authRoutes.get("/home", auth, function (req: Request, res: Response) {
  const { user } = req;

  return res.json(user);
});

export default authRoutes;
