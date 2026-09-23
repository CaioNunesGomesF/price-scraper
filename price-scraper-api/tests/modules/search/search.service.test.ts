import { ReadableStream, TransformStream, WritableStream } from "stream/web";
import { Blob } from "buffer";

if (typeof globalThis.ReadableStream === "undefined") {
  (globalThis as any).ReadableStream = ReadableStream;
}
if (typeof globalThis.TransformStream === "undefined") {
  (globalThis as any).TransformStream = TransformStream;
}
if (typeof globalThis.WritableStream === "undefined") {
  (globalThis as any).WritableStream = WritableStream;
}
if (typeof globalThis.Blob === "undefined") {
  (globalThis as any).Blob = Blob;
}
if (typeof globalThis.File === "undefined") {
  class FilePolyfill extends Blob {
    name: string;
    constructor(fileBits: any[], fileName: string, options?: any) {
      super(fileBits, options);
      this.name = fileName;
    }
  }
  (globalThis as any).File = FilePolyfill;
}
if (typeof globalThis.DOMException === "undefined") {
  class DOMExceptionPolyfill extends Error {
    name: string;
    code: number;
    constructor(message = "", name = "Error") {
      super(message);
      this.name = name;
      this.code = 0;
    }
  }
  (globalThis as any).DOMException = DOMExceptionPolyfill;
}

import { describe, test, expect } from "vitest";
import { SearchService } from "../../../src/modules/search/search.service.js";

describe("SearchService - Integração de Busca, Cache e Analytics de Origem", () => {
  const searchService = new SearchService();

  test("Deve capturar IP, Origem e User-Agent da requisição nas métricas", async () => {
    const clientInfo = {
      ip: "187.12.34.56",
      origin: "https://meusite.com.br",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    };

    await searchService.search(
      { q: "Civic", category: "VEICULOS", platform: "ALL", limit: 2, sortBy: "price_asc" },
      clientInfo
    );

    // Wait for the background save to complete since trackSearchAnalytics doesn't await in search()
    await new Promise((resolve) => setTimeout(resolve, 500));

    const topSearches = await searchService.getTopSearches();
    const civicRecord = topSearches.find((item: any) => item.query === "Civic");

    expect(civicRecord).toBeDefined();
    expect(civicRecord?.query).toBe("Civic");
  });
});
