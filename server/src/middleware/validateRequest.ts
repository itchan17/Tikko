import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/ValidationError";

export const validateRequest =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    // Check for error
    if (!result.success) {
      // Return an error to client containing the error from zod and a message
      return next(new ValidationError(result.error, "Invalid input."));
    }

    req.body = result.data;
    next();
  };
