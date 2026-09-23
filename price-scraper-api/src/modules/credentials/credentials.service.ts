import { saveEncryptedJson, readEncryptedJson } from "../../utils/json.utils.js";
import { AppError } from "../../utils/AppError.js";

export class CredentialsService {
  private getFilePath(serviceName: string): string {
    const cleanName = serviceName.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    return `credentials/${cleanName}.enc`;
  }

  async saveCredentials<T = Record<string, any>>(serviceName: string, data: T): Promise<void> {
    if (!serviceName) {
      throw new AppError("O nome do serviço é obrigatório para salvar credenciais.", 400);
    }
    const filePath = this.getFilePath(serviceName);
    await saveEncryptedJson(filePath, data);
  }

  async getCredentials<T = Record<string, any>>(serviceName: string): Promise<T | null> {
    if (!serviceName) {
      throw new AppError("O nome do serviço é obrigatório para buscar credenciais.", 400);
    }
    const filePath = this.getFilePath(serviceName);
    try {
      return await readEncryptedJson<T>(filePath);
    } catch {
      return null;
    }
  }
}
