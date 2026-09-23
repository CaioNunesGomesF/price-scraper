import { describe, test, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { errorHandler } from "../../src/middleware/errorHandler.middleware.js";
import { AppError } from "../../src/utils/AppError.js";

function createMockResponse() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res) as any;
  res.json = vi.fn().mockReturnValue(res) as any;
  return res;
}

describe("Validação de errorHandler.middleware", () => {
  const req = {} as Request;
  const next = (vi.fn() as unknown) as NextFunction;

  test("Deve tratar erros do tipo AppError e retornar o statusCode e mensagem corretos", () => {
    const res = createMockResponse();
    const error = new AppError("Recurso não encontrado", 404);

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Recurso não encontrado",
    });
  });

  test("Deve tratar erros do tipo ZodError e retornar status 400 com os detalhes de validação", () => {
    const res = createMockResponse();

    const schema = z.object({ email: z.string().email() });
    let zodError!: ZodError;

    try {
      schema.parse({ email: "email_invalido" });
    } catch (err) {
      zodError = err as ZodError;
    }

    errorHandler(zodError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Erro de validação dos dados",
      issues: zodError.issues,
    });
  });

  test("Deve tratar erros genéricos/não mapeados retornando status 500 e mensagem genérica", () => {
    const res = createMockResponse();
    const genericError = new Error("Falha no banco de dados");

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    errorHandler(genericError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Erro interno do servidor",
    });

    expect(consoleSpy).toHaveBeenCalledWith("Erro Não Tratado:", genericError);
    consoleSpy.mockRestore();
  });
});
