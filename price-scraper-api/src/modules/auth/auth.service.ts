import argon2 from "argon2";
import jwt from "jsonwebtoken";
import db from "../../config/database.js";
import { usersTable } from "./auth.schema.js";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_12345";

export class AuthService {
  async register(name: string, email: string, passwordRaw: string) {
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      throw new Error("E-mail já está em uso.");
    }
    
    const passwordHash = await argon2.hash(passwordRaw);
    const result = await db.insert(usersTable).values({
      name,
      email,
      passwordHash,
    }).returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email });
    
    const user = result[0]!;
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return { user, token };
  }

  async login(email: string, passwordRaw: string) {
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    const user = users[0];
    if (!user) {
      throw new Error("Credenciais inválidas.");
    }
    
    const isValid = await argon2.verify(user.passwordHash, passwordRaw);
    if (!isValid) {
      throw new Error("Credenciais inválidas.");
    }
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return {
      user: { id: user.id, name: user.name, email: user.email },
      token
    };
  }
}
