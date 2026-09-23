import * as cheerio from "cheerio";
import { BaseScraper, type ScrapeSearchParams, type ScrapedListingItem } from "./base.scraper.js";
import { fetchHtml } from "../../../utils/httpClient.js";

export class AmazonScraper extends BaseScraper {
  readonly platform = "AMAZON" as const;

  async search(params: ScrapeSearchParams): Promise<ScrapedListingItem[]> {
    const formattedQuery = encodeURIComponent(params.query.trim());
    let url = `https://www.amazon.com.br/s?k=${formattedQuery}`;

    if (params.minPrice || params.maxPrice) {
      const min = params.minPrice ? Math.floor(params.minPrice * 100) : "";
      const max = params.maxPrice ? Math.floor(params.maxPrice * 100) : "";
      url += `&rh=p_36%3A${min}-${max}`;
    }

    try {
      const html = await fetchHtml(url, {
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        
      });
      return this.parseHtml(html, params.limit || 30);
    } catch (error) {
      console.error("[AmazonScraper] Erro ao buscar anúncios na Amazon Brasil:", error);
      return [];
    }
  }

  public parseHtml(html: string, limit = 30): ScrapedListingItem[] {
    const $ = cheerio.load(html);
    const items: ScrapedListingItem[] = [];

    const selectors = '[data-component-type="s-search-result"], .s-result-item[data-asin]';

    $(selectors).each((_: any, element: any) => {
      const $el = $(element);
      const asin = $el.attr("data-asin");
      if (!asin || asin.trim() === "") return;

      const title = $el.find("h2 a span, h2 span, .a-text-normal").first().text().trim();
      const relativeUrl = $el.find("h2 a.a-link-normal, a.a-link-normal").first().attr("href");
      if (!title || !relativeUrl) return;

      const fullUrl = relativeUrl.startsWith("http") ? relativeUrl : `https://www.amazon.com.br${relativeUrl}`;

      // Preço na Amazon (.a-price-whole + .a-price-fraction ou .a-offscreen)
      const priceWhole = $el.find(".a-price-whole").first().text().replace(/[^\d]/g, "");
      const priceFraction = $el.find(".a-price-fraction").first().text().replace(/[^\d]/g, "") || "00";

      let price = 0;
      if (priceWhole) {
        price = parseFloat(`${priceWhole}.${priceFraction}`);
      } else {
        const offscreenPrice = $el.find(".a-price .a-offscreen").first().text().replace(/[^\d.,]/g, "").replace(",", ".");
        price = parseFloat(offscreenPrice) || 0;
      }

      const imageUrl = $el.find("img.s-image").attr("src");

      // Avaliações/Rating
      const ratingText = $el.find("i.a-icon-star-small span, span[aria-label*='de 5 estrelas'], .a-icon-star span").first().text().trim();
      let rating: number | undefined;
      if (ratingText) {
        const match = ratingText.match(/([\d,.]+)\s*de\s*5/i);
        if (match && match[1]) {
          rating = parseFloat(match[1].replace(",", "."));
        }
      }

      const reviewsText = $el.find("span[aria-label*='avaliações'], a .a-size-base").first().text().replace(/[^\d]/g, "");
      const reviewsCount = reviewsText ? parseInt(reviewsText, 10) : undefined;

      items.push({
        platform: this.platform,
        externalId: asin,
        title,
        price,
        currency: "BRL",
        url: fullUrl,
        imageUrl: imageUrl || undefined,
        rating,
        reviewsCount,
        sellerName: "Amazon.com.br",
        condition: title.toLowerCase().includes("recondicionado") || title.toLowerCase().includes("usado") ? "USADO" : "NOVO",
      });
    });

    return items.slice(0, limit);
  }
}
