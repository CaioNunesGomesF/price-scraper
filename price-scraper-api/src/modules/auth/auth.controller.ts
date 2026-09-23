import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.json({ status: "success", data: result });
  } catch (error: any) {
    return res.status(401).json({ status: "error", message: error.message });
  }
}

export async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password);
    return res.status(201).json({ status: "success", data: result });
  } catch (error: any) {
    return res.status(400).json({ status: "error", message: error.message });
  }
}
