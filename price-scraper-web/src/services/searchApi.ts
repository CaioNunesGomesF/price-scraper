import { api } from "./http.js";

export interface ListingItem {
  id?: string;
  platform: "MERCADO_LIVRE" | "OLX" | "GGMAX" | "AMAZON" | "OUTROS";
  externalId?: string;
  title: string;
  price: number;
  currency: string;
  url: string;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  sellerName?: string;
  sellerReputation?: string;
  location?: string;
  condition?: string;
}

export interface SearchResponse {
  status: string;
  query: string;
  category: string;
  fromCache: boolean;
  expiresAt: string;
  total: number;
  results: ListingItem[];
  warnings?: string[];
}

export interface TopSearch {
  query: string;
  category: string;
  searchCount: number;
  lastClientIp?: string;
  lastOrigin?: string;
  lastSearchedAt: string;
}

export interface TopSearchesResponse {
  status: string;
  total: number;
  data: TopSearch[];
}

export interface CategoriesResponse {
  status: string;
  data: Record<string, number>;
}

export type Category = "IMOVEIS" | "VEICULOS" | "JOGOS" | "ELETRONICOS" | "OUTROS";
export type Platform = "MERCADO_LIVRE" | "OLX" | "GGMAX" | "AMAZON" | "ALL";
export type SortBy = "price_asc" | "price_desc" | "rating_desc" | "recent";

export interface SearchParams {
  q: string;
  category?: Category;
  platform?: Platform;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: SortBy;
  limit?: number;
}

export interface CompareResponse {
  status: string;
  data: {
    summary: {
      minPrice: number;
      maxPrice: number;
      priceDifference: number;
      totalItems: number;
    };
    items: Array<ListingItem & {
      isBestPrice: boolean;
      savingsFromMax: number;
      savingsPercentage: number;
      recommendation: string;
    }>;
  };
}

export const searchApi = {
  search: async (params: SearchParams, signal?: AbortSignal): Promise<SearchResponse> => {
    const response = await api.get<any>("/search", { params, signal });
    return {
      status: response.data.status,
      query: response.data.query,
      category: response.data.category,
      fromCache: response.data.fromCache,
      expiresAt: response.data.expiresAt,
      total: response.data.total,
      results: response.data.data,
      warnings: response.data.warnings,
    };
  },

  getTopSearches: async (limit = 10): Promise<TopSearchesResponse> => {
    const res = await api.get<TopSearchesResponse>("/search/analytics/top", { params: { limit } });
    return res.data;
  },

  getCategories: async (): Promise<CategoriesResponse> => {
    const res = await api.get<CategoriesResponse>("/search/analytics/categories");
    return res.data;
  },

  compare: async (items: ListingItem[]): Promise<CompareResponse> => {
    const res = await api.post<CompareResponse>("/search/compare", { items });
    return res.data;
  }
};
