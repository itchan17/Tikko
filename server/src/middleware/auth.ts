import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/auth.types";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

interface JwtPayload {
  id: string;
  username: string;
  exp: number;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;

    // Check if there's a token
    if (!token) {
      return res.sendStatus(403);
    }

    // Decode the token
    const data = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Check for expiration
    if (Date.now() / 1000 > data.exp) return res.sendStatus(401);

    // Set the user of the request
    (req as CustomRequest).user = { id: data.id, username: data.username };
    next();
  } catch (err) {
    res.status(401).send("Please authenticate");
  }
};
