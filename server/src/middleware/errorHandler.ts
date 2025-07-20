import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { CustomError } from "../errors/CustomError";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json(error.serialize());
  }
};
