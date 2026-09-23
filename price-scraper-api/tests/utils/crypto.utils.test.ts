import { describe, test, expect } from "vitest";
import {
  hashPassword,
  compareHash,
  encryptData,
  decryptData,
  decryptField,
  decryptList,
} from "../../src/utils/crypto.utils.js";
import { AppError } from "../../src/utils/AppError.js";

describe("Validação de funções de crypto.utils", () => {
  test("Deve gerar hash de senha com argon2 e validar comparando com sucesso", async () => {
    const password = "minhaSenhaSegura123";
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash.startsWith("$argon2")).toBe(true);

    const isMatch = await compareHash(password, hash);
    expect(isMatch).toBe(true);

    const isInvalidMatch = await compareHash("senhaIncorreta", hash);
    expect(isInvalidMatch).toBe(false);
  });

  test("Deve lançar AppError ao comparar hash inválido ou incompatível", async () => {
    await expect(compareHash("123456", "hashInvalido")).rejects.toThrow(AppError);
  });

  test("Deve criptografar e descriptografar um texto via AES-256-GCM", () => {
    const originalText = "Mensagem ultrassecreta";
    const encrypted = encryptData(originalText);

    expect(encrypted).not.toBe(originalText);
    expect(encrypted.split(":")).toHaveLength(3);

    const decrypted = decryptData(encrypted);
    expect(decrypted).toBe(originalText);
  });

  test("Deve lançar AppError ao descriptografar dado corrompido ou mal formatado", () => {
    expect(() => decryptData("dado_invalido")).toThrow(AppError);
  });

  test("Deve descriptografar campos específicos de um objeto usando decryptField", () => {
    const secretText = "Valor Secreto";
    const encryptedSecret = encryptData(secretText);

    const record = {
      id: 1,
      secretField: encryptedSecret,
      publicField: "Dados Abertos",
    };

    const decryptedRecord = decryptField(record, "secretField");
    expect(decryptedRecord.secretField).toBe(secretText);
    expect(decryptedRecord.publicField).toBe("Dados Abertos");
  });

  test("Deve descriptografar campos específicos em uma lista de objetos usando decryptList", () => {
    const secret1 = encryptData("Segredo 1");
    const secret2 = encryptData("Segredo 2");

    const list = [
      { id: 1, secret: secret1 },
      { id: 2, secret: secret2 },
    ];

    const decryptedList = decryptList(list, "secret");
    expect(decryptedList[0]?.secret).toBe("Segredo 1");
    expect(decryptedList[1]?.secret).toBe("Segredo 2");
  });
});
