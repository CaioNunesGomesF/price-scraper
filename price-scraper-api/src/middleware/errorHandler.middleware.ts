import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Erro de validação dos dados",
      issues: err.issues,
    });
  }

  console.error("Erro Não Tratado:", err);

  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  });
}
