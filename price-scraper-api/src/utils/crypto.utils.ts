import crypto from "crypto";
import argon2 from "argon2";
import config from "../config/config.js";
import { AppError } from "./AppError.js";

const ALGORITHM = "aes-256-gcm";

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password + config.encryption.pepper);
}

export const encrypt = hashPassword;

export async function compareHash(password: string, hash: string): Promise<boolean> {
  if (!hash || !hash.startsWith("$argon2")) {
    throw new AppError("A senha cadastrada possui formato incompatível. Entre em contato com o administrador do sistema.", 500);
  }

  const newValue = password + config.encryption.pepper;
  return await argon2.verify(hash, newValue);
}

export function encryptData(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, config.encryption.masterKey, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${encrypted}`;
}

export function decryptData(dbRecord: string): string {
  const parts = dbRecord.split(":");
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
    throw new AppError("Registro criptografado inválido ou corrompido.", 400);
  }

  const [ivHex, authTagHex, encryptedData] = parts;
  const ivBuffer = Buffer.from(ivHex, "hex");
  const authTagBuffer = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, config.encryption.masterKey, ivBuffer);
  decipher.setAuthTag(authTagBuffer);

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export function decryptField<T extends Record<string, any>>(item: T, ...fields: (keyof T)[]): T {
  if (!item) return item;
  let result = { ...item };
  for (const field of fields) {
    if (result[field] && typeof result[field] === "string") {
      try {
        result[field] = decryptData(result[field] as string) as any;
      } catch {
        // Mantém o valor original se falhar a descriptografia
      }
    }
  }
  return result;
}

export function decryptList<T extends Record<string, any>>(list: T[], ...fields: (keyof T)[]): T[] {
  if (!list || !Array.isArray(list)) return [];
  return list.map((item) => decryptField(item, ...fields));
}
