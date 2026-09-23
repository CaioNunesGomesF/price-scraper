import path from "path";
import fs from "fs";

/**
 * Utilitário centralizado para gerenciamento de arquivos em disco.
 * Toda operação de leitura/escrita/remoção de assets deve passar por aqui.
 */

const DATA_ROOT = path.resolve(process.cwd(), "data");

/**
 * Garante que um diretório exista, criando-o recursivamente se necessário.
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Salva um buffer como arquivo em um subdiretório do `data/`.
 * @param subDir  Subdiretório dentro de `data/` (ex: "platforms")
 * @param filename Nome do arquivo com extensão (ex: "ggmax.png")
 * @param buffer  Conteúdo do arquivo em Buffer
 * @returns Caminho estático público (ex: "/static/platforms/ggmax.png")
 */
export function saveFile(subDir: string, filename: string, buffer: Buffer): string {
  const targetDir = path.join(DATA_ROOT, subDir);
  ensureDir(targetDir);
  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/static/${subDir}/${filename}`;
}

/**
 * Salva um arquivo a partir de uma string base64.
 * @param subDir  Subdiretório dentro de `data/`
 * @param filename Nome do arquivo com extensão
 * @param base64  String base64 (com ou sem prefixo `data:...;base64,`)
 * @returns Caminho estático público
 */
export function saveFileFromBase64(subDir: string, filename: string, base64: string): string {
  const cleanBase64 = base64.replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(cleanBase64, "base64");
  return saveFile(subDir, filename, buffer);
}

/**
 * Verifica se um arquivo existe no `data/`.
 */
export function fileExists(subDir: string, filename: string): boolean {
  return fs.existsSync(path.join(DATA_ROOT, subDir, filename));
}

/**
 * Remove um arquivo do `data/`.
 */
export function deleteFile(subDir: string, filename: string): void {
  const filePath = path.join(DATA_ROOT, subDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Retorna o caminho absoluto de um arquivo no `data/`.
 */
export function getAbsolutePath(subDir: string, filename: string): string {
  return path.join(DATA_ROOT, subDir, filename);
}

/**
 * Lista todos os arquivos de um subdiretório.
 */
export function listFiles(subDir: string): string[] {
  const dirPath = path.join(DATA_ROOT, subDir);
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath);
}
