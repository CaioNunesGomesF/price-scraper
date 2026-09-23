import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_12345";

export interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ status: "error", message: "Token não fornecido" });
  }
  
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: "error", message: "Token mal formatado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { id: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: "error", message: "Token inválido ou expirado" });
  }
}
