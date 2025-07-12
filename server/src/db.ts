const Pool = require("pg").Pool;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,
});

// Check database connection
const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Connected to PostgreSQL at:", result.rows[0].now);
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
  }
};

testConnection();

export default pool;
