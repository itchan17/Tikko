import { Request, Response } from "express";
import pool from "../db";
import { RegistrationData } from "../types/auth.types";
import bcrypt from "bcryptjs";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password }: RegistrationData = req.body;
  try {
    const checkEmail = "SELECT * FROM users WHERE email = $1";
    const emailExists = await pool.query(checkEmail, [email]);

    const checkUsername = "SELECT * FROM users WHERE username = $1";
    const userNameExists = await pool.query(checkUsername, [username]);

    if (emailExists.rows[0]) {
      return res.status(409).json({
        message: "Email already in use",
        field: "email",
      });
    } else if (userNameExists.rows[0]) {
      return res.status(409).json({
        message: "Username already in use",
        field: "username",
      });
    }

    // QUesry for creating user
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
    console.log(error);
  }
};
