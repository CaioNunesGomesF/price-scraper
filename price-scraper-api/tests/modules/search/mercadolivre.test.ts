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
import { MercadoLivreScraper } from "../../../src/modules/search/scrapers/mercadolivre.scraper.js";

describe("MercadoLivreScraper - Validação de Parsing e Estrutura", () => {
  const scraper = new MercadoLivreScraper();

  test("Deve parsear HTML do Mercado Livre e retornar anúncios no formato padronizado", () => {
    const mockHtml = `
      <div class="poly-card">
        <a class="poly-component__title" href="https://produto.mercadolivre.com.br/MLB-12345">Apple iPhone 13 128GB Meia-noite</a>
        <div class="poly-price__current">
          <span class="andaria-money-amount__fraction">3.899</span>
        </div>
        <img class="poly-component__picture" src="https://http2.mlstatic.com/D_123.jpg" />
        <span class="poly-reviews__rating">4.8</span>
        <span class="poly-reviews__total">(142)</span>
        <span class="poly-component__seller">Loja Oficial Apple</span>
      </div>
    `;

    const items = scraper.parseHtml(mockHtml);

    expect(items).toHaveLength(1);
    expect(items[0]?.platform).toBe("MERCADO_LIVRE");
    expect(items[0]?.title).toBe("Apple iPhone 13 128GB Meia-noite");
    expect(items[0]?.price).toBe(3899);
    expect(items[0]?.url).toBe("https://produto.mercadolivre.com.br/MLB-12345");
    expect(items[0]?.rating).toBe(4.8);
    expect(items[0]?.reviewsCount).toBe(142);
    expect(items[0]?.sellerName).toBe("Loja Oficial Apple");
  });
});
