import { CustomError } from "./CustomError";

export class DatabaseError extends CustomError {
  constructor() {
    super("Database Error. Try again later.");
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  statusCode = 500;
  serialize() {
    return {
      error: {
        message: "Database Error. Try again later.",
      },
    };
  }
}
