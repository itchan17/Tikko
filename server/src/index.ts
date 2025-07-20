// server/src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use(routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
