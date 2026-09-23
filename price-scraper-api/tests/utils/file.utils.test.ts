import { describe, test, expect } from "vitest";
import { 
  getStorageFullPath, 
  saveFile, 
  readFile, 
  saveEncryptedFile, 
  readEncryptedFile 
} from "../../src/utils/file.utils.js";
import config from "../../src/config/config.js";
import path from "path";

describe("Validação de funções de file.utils", () => {
  test("Deve ajustar o path do arquivo limpando pontos e barras", () => {
    const result = getStorageFullPath("./token.enc");
    const expected = path.join(config.storage.dir, "token.enc");

    expect(result).toBe(expected);
  });

  test("Deve salvar e ler um arquivo em texto puro", async () => {
    const fileName = "tests/teste_texto.txt";
    const content = "Conteúdo de teste normal";

    await saveFile(fileName, content);
    const readContent = await readFile(fileName);

    expect(readContent).toBe(content);
  });

  test("Deve salvar e ler um arquivo criptografado", async () => {
    const fileName = "tests/teste_crypto.enc";
    const content = "Conteúdo confidencial";

    await saveEncryptedFile(fileName, content);
    const decryptedContent = await readEncryptedFile(fileName);

    expect(decryptedContent).toBe(content);
  });
});
