import type { Request, Response, NextFunction } from "express";
import { searchQuerySchema, compareSchema } from "./search.zod.js";
import { SearchService } from "./search.service.js";

const searchService = new SearchService();

export async function searchController(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedQuery = searchQuerySchema.parse(req.query);

    const clientInfo = {
      ip: (req.headers["x-forwarded-for"] as string) || req.ip || req.socket.remoteAddress,
      origin: (req.headers["origin"] as string) || (req.headers["referer"] as string),
      userAgent: req.headers["user-agent"],
    };

    const result = await searchService.search(validatedQuery, clientInfo);

    return res.json({
      status: "success",
      query: validatedQuery.q,
      category: validatedQuery.category,
      fromCache: result.fromCache,
      expiresAt: result.expiresAt,
      total: result.total,
      data: result.results,
      warnings: result.warnings,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTopSearchesController(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = req.query["limit"] ? parseInt(req.query["limit"] as string, 10) : 10;
    const topSearches = await searchService.getTopSearches(limit);

    return res.json({
      status: "success",
      total: topSearches.length,
      data: topSearches,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryAnalyticsController(req: Request, res: Response, next: NextFunction) {
  try {
    const categoryAnalytics = await searchService.getCategoryAnalytics();

    return res.json({
      status: "success",
      data: categoryAnalytics,
    });
  } catch (error) {
    next(error);
  }
}

export async function compareController(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = compareSchema.parse(req.body);
    const comparison = searchService.compare(dto);
    return res.json({
      status: "success",
      data: comparison,
    });
  } catch (error) {
    next(error);
  }
}

export async function getGgmaxCatalogController(req: Request, res: Response, next: NextFunction) {
  try {
    const catalog = await import("./data/ggmax_catalog.json", { with: { type: "json" } }).then(m => m.default).catch(() => ({}));
    return res.json({
      status: "success",
      data: catalog,
    });
  } catch (error) {
    next(error);
  }
}
