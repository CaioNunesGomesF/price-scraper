import { describe, test, expect } from "vitest";
import { CredentialsService } from "../../../src/modules/credentials/credentials.service.js";

describe("CredentialsService - Criptografia AES-256 de Chaves e Tokens", () => {
  const credentialsService = new CredentialsService();

  test("Deve salvar e recuperar credenciais de API criptografadas em AES-256 com fidelidade", async () => {
    const serviceName = "MERCADO_LIVRE";
    const secretData = {
      clientId: "123456789",
      clientSecret: "minha_chave_ultra_secreta_abc123",
      accessToken: "APP_USR-12345-67890-token",
      refreshToken: "TG-12345-refresh",
    };

    await credentialsService.saveCredentials(serviceName, secretData);

    const retrievedData = await credentialsService.getCredentials<typeof secretData>(serviceName);

    expect(retrievedData).toBeDefined();
    expect(retrievedData).not.toBeNull();
    expect(retrievedData?.clientId).toBe("123456789");
    expect(retrievedData?.clientSecret).toBe("minha_chave_ultra_secreta_abc123");
    expect(retrievedData?.accessToken).toBe("APP_USR-12345-67890-token");
  });

  test("Deve retornar null ao tentar ler credenciais inexistentes", async () => {
    const data = await credentialsService.getCredentials("SERVICO_INEXISTENTE");
    expect(data).toBeNull();
  });
});
