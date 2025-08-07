import { Request, Response, NextFunction } from "express";
import pool from "../db";
import { RegistrationData, LoginData } from "../types/auth.types";
import bcrypt from "bcryptjs";
import { ValidationError } from "../errors/ValidationError";
import jwt from "jsonwebtoken";
import { CookieOptions } from "express";

// Register Controller
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password }: RegistrationData = req.body;

  try {
    // DB queries
    const checkEmail = "SELECT * FROM users WHERE email = $1";
    const emailExists = await pool.query(checkEmail, [email]);

    const checkUsername = "SELECT * FROM users WHERE username = $1";
    const userNameExists = await pool.query(checkUsername, [username]);

    // Validate inputs are unqique else return an error
    if (emailExists.rows[0]) {
      return next(
        new ValidationError(
          { email: "This email address is already registered." },
          "Validation failed."
        )
      );
    } else if (userNameExists.rows[0]) {
      return next(
        new ValidationError(
          { username: "This username is already registered." },
          "Validation failed."
        )
      );
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

    return res.status(200).json({ message: "Registration successful." });
  } catch (error) {
    return next(error);
  }
};

// Login Controller
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password }: LoginData = req.body;

    const checkEmail = "SELECT * FROM users WHERE email = $1";
    const user = await pool.query(checkEmail, [email]);

    // Check if email exists in database
    if (!user.rows[0]) {
      return next(
        new ValidationError(
          { email: "Invalid login credentials. Please try again." },
          "Login failed."
        )
      );
    }

    // Compare hashed password to user input password
    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (isMatch) {
      // Data that will bes tored in the token
      const userPayload = {
        id: user.rows[0].id?.toString(),
      };

      // Create a token
      const token = jwt.sign(userPayload, process.env.JWT_SECRET as string, {
        expiresIn: "2 days",
      });

      const cookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      };

      // Set the cookie
      res.cookie("access_token", token, cookieOptions);
      res.status(200).json({ message: "Login successful." });
    } else {
      // Return error if password is incorrect
      return next(
        new ValidationError(
          { password: "Invalid login credentials. Please try again." },
          "Login failed."
        )
      );
    }

    return res.json(user.rows[0]);
  } catch (error) {
    return next(error);
  }
};
