import crypto from "crypto";
import type { SearchQueryDto } from "./search.zod.js";
import { BaseScraper, type ScrapedListingItem } from "./scrapers/base.scraper.js";
import { MercadoLivreScraper } from "./scrapers/mercadolivre.scraper.js";
import { OlxScraper } from "./scrapers/olx.scraper.js";
import { GgmaxScraper } from "./scrapers/ggmax.scraper.js";
import { AmazonScraper } from "./scrapers/amazon.scraper.js";

const CACHE_TTL_MINUTES = 30;

const scrapersMap: Record<string, BaseScraper> = {
  MERCADO_LIVRE: new MercadoLivreScraper(),
  OLX: new OlxScraper(),
  GGMAX: new GgmaxScraper(),
  AMAZON: new AmazonScraper(),
};

interface CacheEntry {
  expiresAt: Date;
  data: ScrapedListingItem[];
  warnings?: string[];
}
const memoryCache = new Map<string, CacheEntry>();

export interface RequestClientInfo {
  ip?: string | undefined;
  origin?: string | undefined;
  userAgent?: string | undefined;
}

interface AnalyticsRecord {
  query: string;
  category: string;
  searchCount: number;
  lastClientIp?: string | undefined;
  lastOrigin?: string | undefined;
  lastUserAgent?: string | undefined;
  lastSearchedAt: Date;
}
const analyticsStore = new Map<string, AnalyticsRecord>();

export class SearchService {
  private generateQueryHash(dto: SearchQueryDto): string {
    const key = `${dto.q.toLowerCase().trim()}_${dto.category}_${dto.minPrice || 0}_${dto.maxPrice || 0}_${dto.platform}`;
    return crypto.createHash("sha256").update(key).digest("hex");
  }

  private trackSearchAnalytics(dto: SearchQueryDto, clientInfo?: RequestClientInfo) {
    const key = `${dto.q.toLowerCase().trim()}_${dto.category}`;
    const existing = analyticsStore.get(key);

    if (existing) {
      existing.searchCount += 1;
      existing.lastClientIp = clientInfo?.ip || existing.lastClientIp;
      existing.lastOrigin = clientInfo?.origin || existing.lastOrigin;
      existing.lastUserAgent = clientInfo?.userAgent || existing.lastUserAgent;
      existing.lastSearchedAt = new Date();
    } else {
      analyticsStore.set(key, {
        query: dto.q.trim(),
        category: dto.category,
        searchCount: 1,
        lastClientIp: clientInfo?.ip,
        lastOrigin: clientInfo?.origin,
        lastUserAgent: clientInfo?.userAgent,
        lastSearchedAt: new Date(),
      });
    }
  }

  async search(dto: SearchQueryDto, clientInfo?: RequestClientInfo) {
    this.trackSearchAnalytics(dto, clientInfo);

    const queryHash = this.generateQueryHash(dto);
    const now = new Date();

    const cached = memoryCache.get(queryHash);
    if (cached && cached.expiresAt > now) {
      const filteredAndSorted = this.filterAndSort(cached.data, dto);
      return {
        fromCache: true,
        expiresAt: cached.expiresAt,
        total: filteredAndSorted.length,
        results: filteredAndSorted,
        warnings: cached.warnings,
      };
    }

    let activeScrapers: BaseScraper[] = [];
    if (!dto.platform || dto.platform === "ALL") {
      activeScrapers = Object.values(scrapersMap);
    } else {
      const selectedKeys = dto.platform.split(",").map((p) => p.trim());
      activeScrapers = selectedKeys
        .map((key) => scrapersMap[key])
        .filter((s): s is BaseScraper => Boolean(s));
      if (activeScrapers.length === 0) {
        activeScrapers = Object.values(scrapersMap);
      }
    }

    const warnings: string[] = [];
    const promises = activeScrapers.map(async (scraper) => {
      try {
        const results = await scraper.search({
          query: dto.q,
          category: dto.category,
          minPrice: dto.minPrice,
          maxPrice: dto.maxPrice,
          limit: dto.limit || 60,
        });
        if (results.length === 0) {
          warnings.push(`${scraper.platform} não retornou nenhum resultado. Pode ser um bloqueio antibot.`);
        }
        return results;
      } catch (err) {
        console.error(`[SearchService] Erro no scraper ${scraper.platform}:`, err);
        warnings.push(`${scraper.platform} falhou durante a extração de dados.`);
        return [] as ScrapedListingItem[];
      }
    });

    const rawResults = await Promise.all(promises);
    const allListings = rawResults.flat();

    const expiresAt = new Date(now.getTime() + CACHE_TTL_MINUTES * 60 * 1000);
    memoryCache.set(queryHash, {
      expiresAt,
      data: allListings,
      ...(warnings.length > 0 ? { warnings } : {}),
    });

    const finalResults = this.filterAndSort(allListings, dto);

    return {
      fromCache: false,
      expiresAt,
      total: finalResults.length,
      results: finalResults,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  getTopSearches(limit = 10) {
    const list = Array.from(analyticsStore.values());
    list.sort((a, b) => b.searchCount - a.searchCount);
    return list.slice(0, limit);
  }

  getCategoryAnalytics() {
    const categoryTotals: Record<string, number> = {};
    for (const record of analyticsStore.values()) {
      categoryTotals[record.category] = (categoryTotals[record.category] || 0) + record.searchCount;
    }
    return categoryTotals;
  }


  compare(dto: { items: any[] }) {
    const items = dto.items;
    const minPrice = Math.min(...items.map((i) => i.price));
    const maxPrice = Math.max(...items.map((i) => i.price));
    const priceDiff = maxPrice - minPrice;
    
    const analyzedItems = items.map((item) => {
      const isBestPrice = item.price === minPrice;
      const savings = maxPrice - item.price;
      const savingsPercentage = maxPrice > 0 ? (savings / maxPrice) * 100 : 0;
      
      return {
        ...item,
        isBestPrice,
        savingsFromMax: savings,
        savingsPercentage: parseFloat(savingsPercentage.toFixed(2)),
        recommendation: isBestPrice ? "Melhor Custo-Benefício" : (item.condition === "NOVO" ? "Novo, mas mais caro" : "Não recomendado"),
      };
    });

    return {
      summary: {
        minPrice,
        maxPrice,
        priceDifference: priceDiff,
        totalItems: items.length,
      },
      items: analyzedItems,
    };
  }

  private filterAndSort(items: ScrapedListingItem[], dto: SearchQueryDto): ScrapedListingItem[] {

    let filtered = [...items].filter(i => i.price > 0);

    if (dto.minPrice !== undefined) {
      filtered = filtered.filter((i) => i.price >= dto.minPrice!);
    }
    if (dto.maxPrice !== undefined) {
      filtered = filtered.filter((i) => i.price <= dto.maxPrice!);
    }
    if (dto.minRating !== undefined) {
      filtered = filtered.filter((i) => (i.rating || 0) >= dto.minRating!);
    }

    if (dto.sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (dto.sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (dto.sortBy === "rating_desc") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered.slice(0, dto.limit);
  }
}
