import db from "../../config/database.js";
import { searchQueriesTable, listingsTable } from "./search.schema.js";
import { eq, sql, desc, count } from "drizzle-orm";
import type { SearchQueryDto } from "./search.zod.js";
import type { RequestClientInfo } from "./search.service.js";
import type { ScrapedListingItem } from "./scrapers/base.scraper.js";

export class SearchRepository {
  async trackSearch(
    dto: SearchQueryDto,
    queryHash: string,
    clientInfo?: RequestClientInfo,
    expiresAt?: Date
  ) {
    // 1. Tentar achar a query existente
    const existing = await db
      .select()
      .from(searchQueriesTable)
      .where(eq(searchQueriesTable.queryHash, queryHash))
      .limit(1);

    const expires = expiresAt || new Date(Date.now() + 30 * 60000);

    if (existing.length > 0) {
      const q = existing[0]!;
      await db
        .update(searchQueriesTable)
        .set({
          searchCount: q.searchCount + 1,
          lastClientIp: clientInfo?.ip || q.lastClientIp,
          lastOrigin: clientInfo?.origin || q.lastOrigin,
          lastUserAgent: clientInfo?.userAgent || q.lastUserAgent,
          lastSearchedAt: new Date(),
          expiresAt: expires,
          updatedAt: new Date(),
        })
        .where(eq(searchQueriesTable.id, q.id));

      return q.id;
    } else {
      const inserted = await db
        .insert(searchQueriesTable)
        .values({
          queryHash,
          query: dto.q.trim(),
          category: dto.category,
          minPrice: dto.minPrice ? dto.minPrice.toString() : null,
          maxPrice: dto.maxPrice ? dto.maxPrice.toString() : null,
          searchCount: 1,
          lastClientIp: clientInfo?.ip,
          lastOrigin: clientInfo?.origin,
          lastUserAgent: clientInfo?.userAgent,
          lastSearchedAt: new Date(),
          expiresAt: expires,
        })
        .returning({ id: searchQueriesTable.id });
      
      return inserted[0]!.id;
    }
  }

  async getTopSearches(limit = 10) {
    return db
      .select({
        query: searchQueriesTable.query,
        category: searchQueriesTable.category,
        count: searchQueriesTable.searchCount,
      })
      .from(searchQueriesTable)
      .orderBy(desc(searchQueriesTable.searchCount))
      .limit(limit);
  }

  async getCategoryAnalytics() {
    return db
      .select({
        category: searchQueriesTable.category,
        totalSearches: sql<number>`SUM(${searchQueriesTable.searchCount})::int`,
      })
      .from(searchQueriesTable)
      .groupBy(searchQueriesTable.category)
      .orderBy(desc(sql`SUM(${searchQueriesTable.searchCount})`));
  }
}
