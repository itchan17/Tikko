import { CustomError } from "./CustomError";
import { ZodError, z } from "zod";

export class ValidationError extends CustomError {
  statusCode = 400;

  // Requires an argument with a type of ZodError
  constructor(public field: ZodError, public message: "Invalid input.") {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serialize() {
    return {
      error: {
        field: z.flattenError(this.field).fieldErrors, // Return a formatted error
        message: this.message,
      },
    };
  }
}
