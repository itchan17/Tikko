import { Request } from "express";

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CustomRequest extends Request {
  user: { id: string; username: string };
}
