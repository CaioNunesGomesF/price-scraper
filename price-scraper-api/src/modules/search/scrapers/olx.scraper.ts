import * as cheerio from "cheerio";
import { BaseScraper, type ScrapeSearchParams, type ScrapedListingItem } from "./base.scraper.js";
import { fetchHtml } from "../../../utils/httpClient.js";

interface OlxAdRscItem {
  listId?: number;
  title?: string;
  subject?: string;
  url?: string;
  adUrl?: string;
  link?: string;
  priceValue?: string;
  price?: string | number;
  images?: Array<{ original?: string; thumbnail?: string }>;
  image?: string;
  location?: string;
  categoryName?: string;
  properties?: Array<{ name: string; value: string }>;
}

export class OlxScraper extends BaseScraper {
  readonly platform = "OLX" as const;

  private getCategoryUrlPath(category?: string): string {
    switch (category) {
      case "VEICULOS":
        return "autos-e-pecas";
      case "IMOVEIS":
        return "imoveis";
      case "ELETRONICOS":
        return "eletronicos-e-celulares";
      case "JOGOS":
        return "musica-e-hobbies";
      default:
        return "brasil";
    }
  }

  async search(params: ScrapeSearchParams): Promise<ScrapedListingItem[]> {
    const formattedQuery = encodeURIComponent(params.query.trim());
    const categoryPath = this.getCategoryUrlPath(params.category);
    let url = `https://www.olx.com.br/${categoryPath}?q=${formattedQuery}`;

    if (params.minPrice) url += `&ps=${Math.floor(params.minPrice)}`;
    if (params.maxPrice) url += `&pe=${Math.floor(params.maxPrice)}`;

    try {
      const html = await fetchHtml(url);
      return this.parseHtml(html, params.limit ?? 30);
    } catch (error) {
      console.error("[OlxScraper] Erro ao buscar anúncios na OLX:", error);
      return [];
    }
  }

  public parseHtml(html: string, limit = 30): ScrapedListingItem[] {
    const $ = cheerio.load(html);
    const items: ScrapedListingItem[] = [];

    // Estratégia 1: RSC Payload — Next.js 14+ injeta dados via self.__next_f.push
    // Os dados de anúncios ficam serializados como JSON-string dentro desses chunks
    const rscItems = this.parseRscPayload(html);
    if (rscItems.length > 0) {
      return rscItems.slice(0, limit);
    }

    // Estratégia 2: __NEXT_DATA__ (versão antiga do Next.js)
    const nextDataScript = $("#__NEXT_DATA__").html();
    if (nextDataScript) {
      try {
        const parsed = JSON.parse(nextDataScript) as {
          props?: { pageProps?: { ads?: OlxAdRscItem[]; searchList?: { ads?: OlxAdRscItem[] } } };
        };
        const ads =
          parsed?.props?.pageProps?.ads ??
          parsed?.props?.pageProps?.searchList?.ads ??
          [];

        for (const ad of ads) {
          const item = this.mapAdToItem(ad);
          if (item) items.push(item);
        }

        if (items.length > 0) return items.slice(0, limit);
      } catch {
        // Fallback para DOM abaixo
      }
    }

    // Estratégia 3: DOM direto (fallback para outros formatos)
    $("[data-lurker-detail='list_id'], section[class*='olx-ad-card'], article[data-cy='l-card']").each(
      (_: unknown, element: unknown) => {
        const $el = $(element as Parameters<typeof $>[0]);
        const title = $el.find("h2, [class*='title']").first().text().trim();
        const href = $el.find("a").first().attr("href");
        if (!title || !href) return;

        const priceText = $el
          .find("[data-lurker-detail='price'], [class*='price']")
          .first()
          .text()
          .replace(/[^\d]/g, "");
        const price = parseFloat(priceText) || 0;
        const imageUrl =
          $el.find("img").attr("src") ?? $el.find("img").attr("data-src");
        const location =
          $el.find("[data-lurker-detail='location'], [class*='location']").first().text().trim() ||
          undefined;

        items.push({
          platform: this.platform,
          title,
          price,
          currency: "BRL",
          url: href.startsWith("http") ? href : `https://www.olx.com.br${href}`,
          imageUrl: imageUrl ?? undefined,
          location,
          condition: "USADO",
        });
      }
    );

    return items.slice(0, limit);
  }

  /**
   * Extrai anúncios do payload RSC (React Server Components) do Next.js 14+.
   * A OLX injeta os dados via: self.__next_f.push([1, "<json-string>"])
   */
  private parseRscPayload(html: string): ScrapedListingItem[] {
    const items: ScrapedListingItem[] = [];

    // Extrair todos os chunks RSC
    const rscChunkRegex = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
    let match: RegExpExecArray | null;
    let combinedPayload = "";

    while ((match = rscChunkRegex.exec(html)) !== null) {
      // O conteúdo é uma string JSON com escapes duplos — fazer unescape
      try {
        const unescaped = JSON.parse(`"${match[1]}"`);
        combinedPayload += unescaped;
      } catch {
        combinedPayload += match[1] ?? "";
      }
    }

    if (!combinedPayload) return [];

    // Buscar objetos de anúncio pelo campo listId (identificador único OLX)
    // O payload RSC serializa arrays de anúncios como JSON inline
    const adObjectRegex =
      /"listId"\s*:\s*(\d+)[\s\S]*?"(?:subject|title)"\s*:\s*"([^"]+)"[\s\S]*?"priceValue"\s*:\s*"([^"]+)"[\s\S]*?"(?:adUrl|link|url)"\s*:\s*"([^"]+)"/g;

    while ((match = adObjectRegex.exec(combinedPayload)) !== null) {
      const listId = match[1];
      const title = match[2];
      const priceStr = match[3] ?? "0";
      const url = match[4] ?? "";

      // Limpar preço: "R$ 1.500" → 1500
      const price = parseFloat(priceStr.replace(/[^\d,]/g, "").replace(",", ".")) || 0;

      // Tentar extrair imagem próxima ao listId encontrado
      const contextStart = match.index;
      const contextEnd = Math.min(match.index + 600, combinedPayload.length);
      const context = combinedPayload.substring(contextStart, contextEnd);

      const imgMatch = context.match(/"(?:image|thumbnail|original)"\s*:\s*"([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/);
      const imageUrl = imgMatch?.[1];

      const locationMatch = context.match(/"location"\s*:\s*"([^"]+)"/);
      const location = locationMatch?.[1];

      if (title && url) {
        items.push({
          platform: this.platform,
          externalId: listId,
          title: title.trim(),
          price,
          currency: "BRL",
          url: url.startsWith("http") ? url : `https://www.olx.com.br${url}`,
          imageUrl: imageUrl ?? undefined,
          location: location ?? undefined,
          condition: "USADO",
        });
      }
    }

    return items;
  }

  private mapAdToItem(ad: OlxAdRscItem): ScrapedListingItem | null {
    const title = ad.title ?? ad.subject;
    const url = ad.url ?? ad.adUrl ?? ad.link;
    if (!title || !url) return null;

    const rawPrice = typeof ad.price === "string" ? ad.price : String(ad.price ?? "0");
    const priceStr = ad.priceValue ?? rawPrice;
    const price = parseFloat(priceStr.replace(/[^\d,]/g, "").replace(",", ".")) || 0;

    const imageUrl =
      ad.images?.[0]?.original ??
      ad.images?.[0]?.thumbnail ??
      ad.image;

    return {
      platform: this.platform,
      externalId: ad.listId ? String(ad.listId) : undefined,
      title: title.trim(),
      price,
      currency: "BRL",
      url: url.startsWith("http") ? url : `https://www.olx.com.br${url}`,
      imageUrl: imageUrl ?? undefined,
      location: ad.location ?? undefined,
      condition: "USADO",
    };
  }
}
