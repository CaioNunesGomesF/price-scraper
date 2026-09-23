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
import { OlxScraper } from "../../../src/modules/search/scrapers/olx.scraper.js";

describe("OlxScraper - Validação de Parsing e Categorias da OLX", () => {
  const scraper = new OlxScraper();

  test("Deve extrair anúncios de JSON estruturado __NEXT_DATA__ da OLX", () => {
    const mockNextData = `
      <html>
        <body>
          <script id="__NEXT_DATA__" type="application/json">
            {
              "props": {
                "pageProps": {
                  "ads": [
                    {
                      "listId": "1298371029",
                      "title": "Honda Civic 2.0 Flex automatico 2020",
                      "price": "R$ 89.900",
                      "url": "https://www.olx.com.br/autos-e-pecas/carros/honda-civic-1298371029",
                      "images": [{ "original": "https://img.olx.com.br/images/99/civic.jpg" }],
                      "location": "Aracaju, SE",
                      "user": { "name": "Marcos Silva", "rating": 4.9 }
                    }
                  ]
                }
              }
            }
          </script>
        </body>
      </html>
    `;

    const results = scraper.parseHtml(mockNextData);

    expect(results).toHaveLength(1);
    expect(results[0]?.platform).toBe("OLX");
    expect(results[0]?.title).toBe("Honda Civic 2.0 Flex automatico 2020");
    expect(results[0]?.price).toBe(89900);
    expect(results[0]?.externalId).toBe("1298371029");
    expect(results[0]?.sellerName).toBe("Marcos Silva");
    expect(results[0]?.location).toBe("Aracaju, SE");
  });
});
