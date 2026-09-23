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
import { AmazonScraper } from "../../../src/modules/search/scrapers/amazon.scraper.js";

describe("AmazonScraper - Validação de Parsing da Amazon Brasil", () => {
  const scraper = new AmazonScraper();

  test("Deve extrair anúncios de HTML estruturado da Amazon Brasil com preço e avaliações", () => {
    const mockAmazonHtml = `
      <div data-component-type="s-search-result" data-asin="B09G9FPHY6" class="s-result-item">
        <h2>
          <a class="a-link-normal" href="/Apple-iPhone-13-128-GB-Meia-noite/dp/B09G9FPHY6">
            <span>Apple iPhone 13 (128 GB) - Meia-noite</span>
          </a>
        </h2>
        <div class="a-price">
          <span class="a-price-whole">3.899</span>
          <span class="a-price-fraction">90</span>
        </div>
        <img class="s-image" src="https://m.media-amazon.com/images/I/61cwywLZR-L._AC_SX679_.jpg" />
        <i class="a-icon-star-small">
          <span class="a-icon-alt">4,8 de 5 estrelas</span>
        </i>
        <span aria-label="1.540 avaliações">1.540</span>
      </div>
    `;

    const results = scraper.parseHtml(mockAmazonHtml);

    expect(results).toHaveLength(1);
    expect(results[0]?.platform).toBe("AMAZON");
    expect(results[0]?.externalId).toBe("B09G9FPHY6");
    expect(results[0]?.title).toBe("Apple iPhone 13 (128 GB) - Meia-noite");
    expect(results[0]?.price).toBe(3899.9);
    expect(results[0]?.url).toBe("https://www.amazon.com.br/Apple-iPhone-13-128-GB-Meia-noite/dp/B09G9FPHY6");
    expect(results[0]?.rating).toBe(4.8);
    expect(results[0]?.sellerName).toBe("Amazon.com.br");
  });
});
