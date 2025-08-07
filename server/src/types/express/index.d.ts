import * as express from "express";

interface UserPayload {
  user_id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
