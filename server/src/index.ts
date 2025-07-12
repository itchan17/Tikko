// server/src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Request, Response } from "express";
import pool from "./db";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.post("/create-user", async (req: Request, res: Response) => {
  const { username, email } = req.body;
  try {
    const insertUser =
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *";

    const result = await pool.query(insertUser, [username, email]);

    const createdUser = result.rows[0];
    return res.json(createdUser);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
