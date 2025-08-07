import { ZodType, z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/ValidationError";

type Errors = {
  [key: string]: string[];
};

export const validateRequest =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    // Check for error
    if (!result.success) {
      const errors: Errors = z.flattenError(result.error).fieldErrors; // Validation error object with string and array as key value pair

      // Map the object and retrieve only the first item in the message of the key
      const details = Object.fromEntries(
        Object.entries(errors).map(([key, messages]) => [key, messages[0]])
      );

      return next(
        new ValidationError(details, "Validation failed.") // Return the Custom validation error
      );
    }

    req.body = result.data;
    next();
  };
