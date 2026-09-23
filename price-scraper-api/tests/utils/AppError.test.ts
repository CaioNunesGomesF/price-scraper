import { describe, test, expect } from "vitest";
import { AppError } from "../../src/utils/AppError.js";

describe("Validação da classe AppError", () => {
  test("Deve criar uma instância de AppError com os parâmetros padrão", () => {
    const error = new AppError("Erro interno");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Erro interno");
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
  });

  test("Deve criar uma instância de AppError com statusCode e status operável customizados", () => {
    const error = new AppError("Não encontrado", 404, false);

    expect(error.message).toBe("Não encontrado");
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(false);
  });
});
