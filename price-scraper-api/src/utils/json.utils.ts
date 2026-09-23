import { saveEncryptedFile, readEncryptedFile } from "./file.utils.js";

export async function saveEncryptedJson(fileName: string, data: unknown): Promise<void> {
  const jsonString = JSON.stringify(data, null, 2);
  await saveEncryptedFile(fileName, jsonString);
}

export async function readEncryptedJson<T = unknown>(fileName: string): Promise<T> {
  const decryptedJson = await readEncryptedFile(fileName);
  return JSON.parse(decryptedJson) as T;
}
