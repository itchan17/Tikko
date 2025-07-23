import { Request, Response, NextFunction } from "express";
import pool from "../db";
import { RegistrationData, LoginData } from "../types/auth.types";
import bcrypt from "bcryptjs";
import { ConflictError } from "../errors/ConflictError";
import jwt from "jsonwebtoken";
import { CookieOptions } from "express";

export const register = async (
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
      return next(new ConflictError("email", "Email is already in use."));
    } else if (userNameExists.rows[0]) {
      return next(new ConflictError("username", "Username is already in use."));
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
    return next(error);
  }
};

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
        new ConflictError(
          "email",
          "Invalid login credentials. Please try again."
        )
      );
    }

    // Compare hashed password to user input password
    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (isMatch) {
      // Create a token
      const token = jwt.sign(
        { id: user.rows[0].id?.toString(), username: user.rows[0].username },
        process.env.JWT_SECRET as string,
        { expiresIn: "2 days" }
      );

      const cookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      };

      // Set the cookie
      res.cookie("access_token", token, cookieOptions);
      res.sendStatus(200);
    } else {
      // Return error if password is incorrect
      return next(
        new ConflictError(
          "password",
          "Invalid login credentials. Please try again."
        )
      );
    }

    return res.json(user.rows[0]);
  } catch (error) {
    return next(error);
  }
};
