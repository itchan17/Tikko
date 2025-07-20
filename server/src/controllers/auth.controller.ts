import { Request, Response, NextFunction } from "express";
import pool from "../db";
import { RegistrationData } from "../types/auth.types";
import bcrypt from "bcryptjs";
import { ConflictError } from "../errors/ConflictError";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password }: RegistrationData = req.body;
  try {
    const checkEmail = "SELECT * FROM users WHERE email = $1";
    const emailExists = await pool.query(checkEmail, [email]);

    const checkUsername = "SELECT * FROM users WHERE username = $1";
    const userNameExists = await pool.query(checkUsername, [username]);

    // Validate inputs are unqiques else return an error
    if (emailExists.rows[0]) {
      next(new ConflictError("email", "Email is already in use."));
    } else if (userNameExists.rows[0]) {
      next(new ConflictError("username", "Username is already in use."));
    }

    // Query for creating user
    const createUser =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";

    // Hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(createUser, [
      username,
      email,
      hashedPassword,
    ]);

    const createdUser = result.rows[0];
    return res.json(createdUser);
  } catch (error) {
    next(error);
  }
};
