import { api } from "./http.js";
import type { ListingItem } from "./searchApi";

export const favoritesApi = {
  getFavorites: async (): Promise<ListingItem[]> => {
    const res = await api.get("/favorites");
    return res.data.data;
  },
  addFavorite: async (item: ListingItem) => {
    const res = await api.post("/favorites", item);
    return res.data.data;
  },
  removeFavorite: async (url: string) => {
    const res = await api.delete("/favorites", { data: { url } });
    return res.data;
  }
};
