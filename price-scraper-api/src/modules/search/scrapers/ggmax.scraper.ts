import * as cheerio from "cheerio";
import { BaseScraper, type ScrapeSearchParams, type ScrapedListingItem } from "./base.scraper.js";
import { fetchHtml } from "../../../utils/httpClient.js";

export class GgmaxScraper extends BaseScraper {
  readonly platform = "GGMAX" as const;

  async search(params: ScrapeSearchParams): Promise<ScrapedListingItem[]> {
    const formattedQuery = encodeURIComponent(params.query.trim());
    const url = `https://ggmax.com.br/busca?q=${formattedQuery}`;

    try {
      const html = await fetchHtml(url);
      return this.parseHtml(html, params.limit || 30, params.minPrice, params.maxPrice);
    } catch (error) {
      console.error("[GgmaxScraper] Erro ao buscar anúncios no GGMax:", error);
      return [];
    }
  }

  public parseHtml(html: string, limit = 30, minPrice?: number, maxPrice?: number): ScrapedListingItem[] {
    const $ = cheerio.load(html);
    const items: ScrapedListingItem[] = [];

    const selectors = ".announcement-card, .card-item, div[class*='announcement'], a[href*='/anuncio/']";

    $(selectors).each((_: any, element: any) => {
      const $el = $(element);

      const title =
        $el.find(".title, .announcement-title, [class*='title'], h3, a[title]").first().text().trim() ||
        $el.attr("title")?.trim();

      const href =
        $el.find("a[href*='/anuncio/']").first().attr("href") ||
        $el.attr("href") ||
        $el.find("a").first().attr("href");

      if (!title || !href) return;

      const fullUrl = href.startsWith("http") ? href : `https://ggmax.com.br${href}`;
      const priceText = $el.find(".price, .announcement-price, .value, [class*='price']").first().text().replace(/[^\d.,]/g, "").replace(",", ".");
      const price = parseFloat(priceText) || 0;

      if (minPrice !== undefined && price < minPrice) return;
      if (maxPrice !== undefined && price > maxPrice) return;

      const imageUrl = $el.find("img").attr("src") || $el.find("img").attr("data-src");
      const sellerName = $el.find(".seller-name, .user-name, [class*='seller']").first().text().trim() || undefined;
      const ratingText = $el.find(".rating, .stars, [class*='rating']").first().text().trim();
      const rating = ratingText ? parseFloat(ratingText.replace(",", ".")) : undefined;

      items.push({
        platform: this.platform,
        title,
        price,
        currency: "BRL",
        url: fullUrl,
        imageUrl: imageUrl || undefined,
        sellerName,
        rating,
        condition: "DIGITAL",
      });
    });

    return items.slice(0, limit);
  }
}
