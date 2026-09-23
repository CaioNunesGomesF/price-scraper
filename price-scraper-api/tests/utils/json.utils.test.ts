import { describe, test, expect } from "vitest";
import { saveEncryptedJson, readEncryptedJson } from "../../src/utils/json.utils.js";

describe("Validação de funções de json.utils", () => {
  test("Deve salvar um objeto JSON criptografado e lê-lo de volta com fidelidade", async () => {
    const fileName = "tests/teste_json.enc";
    const dataMock = {
      user: "Exemplo",
      permissions: ["admin", "user"],
      active: true,
    };

    await saveEncryptedJson(fileName, dataMock);
    const result = await readEncryptedJson<typeof dataMock>(fileName);

    expect(result).toEqual(dataMock);
    expect(result.user).toBe("Exemplo");
    expect(result.permissions).toContain("admin");
  });
});
