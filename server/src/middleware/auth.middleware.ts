import jwt from "jsonwebtoken";
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
      return res
        .status(403)
        .json({ message: "Access denied. No token provided." });
    }

    // Decode the token
    const data = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Check for expiration
    if (Date.now() / 1000 > data.exp)
      return res
        .status(401)
        .json({ message: "Access denied. Token has expired." });

    // Set the user of the request
    req.user = { user_id: data.id };
    next();
  } catch (err) {
    res.status(401).send("Invalid or expired token.");
  }
};
