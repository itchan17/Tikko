import { error } from "console";
import { CustomError } from "./CustomError";

export class ConflictError extends CustomError {
  statusCode = 409;

  constructor(public field: string, public message: string) {
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serialize() {
    return {
      error: {
        field: this.field,
        message: this.message,
      },
    };
  }
}
