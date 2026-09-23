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
import { GgmaxScraper } from "../../../src/modules/search/scrapers/ggmax.scraper.js";

describe("GgmaxScraper - Validação de Parsing de Jogos e Itens Digitais", () => {
  const scraper = new GgmaxScraper();

  test("Deve extrair anúncios de jogos e contas do GGMax corretamente", () => {
    const mockGgmaxHtml = `
      <div class="announcement-card">
        <a class="announcement-title" href="/anuncio/conta-valorant-radiant-com-skins-vandal-prime">Conta Valorant Radiant com Skins Vandal Prime</a>
        <span class="announcement-price">R$ 350,00</span>
        <img src="https://ggmax.com.br/uploads/card1.jpg" />
        <span class="seller-name">GamerPro99</span>
        <span class="rating">4.95</span>
      </div>
    `;

    const results = scraper.parseHtml(mockGgmaxHtml);

    expect(results).toHaveLength(1);
    expect(results[0]?.platform).toBe("GGMAX");
    expect(results[0]?.title).toBe("Conta Valorant Radiant com Skins Vandal Prime");
    expect(results[0]?.price).toBe(350);
    expect(results[0]?.url).toBe("https://ggmax.com.br/anuncio/conta-valorant-radiant-com-skins-vandal-prime");
    expect(results[0]?.sellerName).toBe("GamerPro99");
    expect(results[0]?.rating).toBe(4.95);
    expect(results[0]?.condition).toBe("DIGITAL");
  });
});
