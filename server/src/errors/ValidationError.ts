import { CustomError } from "./CustomError";

type Details = {
  [key: string]: string;
};

export class ValidationError extends CustomError {
  statusCode = 400;

  // Requires an argument with a type of ZodError
  constructor(public details: Details, public message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serialize() {
    return {
      error: {
        details: this.details,
        message: this.message,
      },
    };
  }
}
