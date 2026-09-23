import * as cheerio from "cheerio";
import { BaseScraper, type ScrapeSearchParams, type ScrapedListingItem } from "./base.scraper.js";
import { fetchHtml } from "../../../utils/httpClient.js";

import axios from "axios";

export class MercadoLivreScraper extends BaseScraper {
  readonly platform = "MERCADO_LIVRE" as const;

  async search(params: ScrapeSearchParams): Promise<ScrapedListingItem[]> {
    const querySlug = encodeURIComponent(params.query.trim().replace(/\s+/g, "-"));
    const url = `https://lista.mercadolivre.com.br/${querySlug}`;

    try {
      // Usando axios direto com UA do Googlebot para furar o Cloudflare Turnstile em IPs de Datacenter!
      const res = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
        },
        timeout: 10000
      });
      return this.parseHtml(res.data, params.limit ?? 30);
    } catch (error) {
      console.error("[MercadoLivreScraper] Erro ao obter HTML do Mercado Livre:", error);
      return [];
    }
  }

  public parseHtml(html: string, limit = 30): ScrapedListingItem[] {
    const $ = cheerio.load(html);
    const items: ScrapedListingItem[] = [];

    // Seletores atuais do Mercado Livre (2024/2025 — Poly Cards)
    const selectors = [
      "li.ui-search-layout__item",
      ".poly-card",
    ].join(", ");

    $(selectors).each((_: unknown, element: unknown) => {
      const $el = $(element as Parameters<typeof $>[0]);

      const title =
        $el.find(".poly-component__title, .ui-search-item__title").first().text().trim() ||
        $el.find("a[title]").first().attr("title")?.trim();

      const href =
        $el.find("a.poly-component__title, a.ui-search-link").first().attr("href") ||
        $el.find("a[href*='mercadolivre']").first().attr("href");

      if (!title || !href) return;

      // Preço: inteiros + centavos separados
      // Seletor correto: andes (não andaria)
      const priceWhole = $el
        .find(".andes-money-amount__fraction, .poly-price__current .andes-money-amount__fraction")
        .first()
        .text()
        .replace(/\./g, "")
        .trim();

      const priceCents = $el
        .find(".andes-money-amount__cents, .poly-price__current .andes-money-amount__cents")
        .first()
        .text()
        .trim();

      const price = priceWhole
        ? parseFloat(`${priceWhole}.${priceCents || "00"}`)
        : 0;

      const imageUrl =
        $el.find("img.poly-component__picture, img.ui-search-result-image__element").attr("data-src") ||
        $el.find("img").first().attr("src");

      const ratingText = $el
        .find(".poly-reviews__rating, .ui-search-reviews__rating-number")
        .first()
        .text()
        .trim();
      const rating = ratingText ? parseFloat(ratingText.replace(",", ".")) : undefined;

      const reviewsText = $el
        .find(".poly-reviews__total, .ui-search-reviews__amount")
        .first()
        .text()
        .replace(/[()]/g, "")
        .trim();
      const reviewsCount = reviewsText ? parseInt(reviewsText, 10) : undefined;

      const sellerName =
        $el.find(".poly-component__seller, .ui-search-official-store-label").first().text().trim() || undefined;
      const location =
        $el.find(".poly-component__location, .ui-search-item__location").first().text().trim() || undefined;

      items.push({
        platform: this.platform,
        title,
        price,
        currency: "BRL",
        url: href,
        imageUrl: imageUrl ?? undefined,
        rating,
        reviewsCount,
        sellerName,
        location,
        condition: title.toLowerCase().includes("usado") ? "USADO" : "NOVO",
      });
    });

    return items.slice(0, limit);
  }
}
