export interface ScrapeSearchParams {
  query: string;
  category?: "IMOVEIS" | "VEICULOS" | "JOGOS" | "ELETRONICOS" | "OUTROS" | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  location?: string | undefined;
  limit?: number | undefined;
  filters?: Record<string, any> | undefined;
}

export interface ScrapedListingItem {
  platform: "MERCADO_LIVRE" | "OLX" | "GGMAX" | "AMAZON" | "OUTROS";
  externalId?: string | undefined;
  title: string;
  price: number;
  currency: string;
  url: string;
  imageUrl?: string | undefined;
  rating?: number | undefined;
  reviewsCount?: number | undefined;
  sellerName?: string | undefined;
  sellerReputation?: string | undefined;
  location?: string | undefined;
  condition?: string | undefined;
  metadata?: Record<string, any> | undefined;
}

export abstract class BaseScraper {
  abstract readonly platform: "MERCADO_LIVRE" | "OLX" | "GGMAX" | "AMAZON" | "OUTROS";

  abstract search(params: ScrapeSearchParams): Promise<ScrapedListingItem[]>;
}
