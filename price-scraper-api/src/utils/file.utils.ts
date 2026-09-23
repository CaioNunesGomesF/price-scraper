import fs from "fs/promises";
import path from "path";
import config from "../config/config.js";
import { encryptData, decryptData } from "./crypto.utils.js";

export function getStorageFullPath(basePath: string): string {
  let caminhoLimpo = basePath;
  while (caminhoLimpo.startsWith(".") || caminhoLimpo.startsWith("/") || caminhoLimpo.startsWith("\\")) {
    caminhoLimpo = caminhoLimpo.slice(1);
  }
  return path.join(config.storage.dir, caminhoLimpo);
}

export async function saveFile(fileName: string, content: string): Promise<void> {
  const fullPath = getStorageFullPath(fileName);
  const dir = path.dirname(fullPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(fullPath, content, "utf-8");
}

export async function readFile(fileName: string): Promise<string> {
  const fullPath = getStorageFullPath(fileName);
  return await fs.readFile(fullPath, "utf-8");
}

export async function saveEncryptedFile(fileName: string, content: string): Promise<void> {
  const fullPath = getStorageFullPath(fileName);
  const dir = path.dirname(fullPath);
  await fs.mkdir(dir, { recursive: true });

  const encryptedContent = encryptData(content);
  await fs.writeFile(fullPath, encryptedContent, "utf-8");
}

export async function readEncryptedFile(fileName: string): Promise<string> {
  const fullPath = getStorageFullPath(fileName);
  const encryptedContent = await fs.readFile(fullPath, "utf-8");
  return decryptData(encryptedContent.trim());
}
