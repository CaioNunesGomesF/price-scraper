import db from "../../config/database.js";
import { favoritesTable } from "./favorites.schema.js";
import { eq, and } from "drizzle-orm";

export class FavoritesService {
  async getFavorites(userId: string) {
    return db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId));
  }

  async addFavorite(userId: string, data: any) {
    const existing = await db.select().from(favoritesTable).where(and(
      eq(favoritesTable.userId, userId),
      eq(favoritesTable.url, data.url)
    )).limit(1);

    if (existing.length > 0) return existing[0];

    const result = await db.insert(favoritesTable).values({
      userId,
      platform: data.platform,
      externalId: data.externalId,
      title: data.title,
      price: data.price.toString(),
      currency: data.currency || "BRL",
      url: data.url,
      imageUrl: data.imageUrl,
      rating: data.rating ? data.rating.toString() : null,
      reviewsCount: data.reviewsCount || null,
      location: data.location,
    }).returning();
    return result[0];
  }

  async removeFavorite(userId: string, url: string) {
    await db.delete(favoritesTable).where(and(
      eq(favoritesTable.userId, userId),
      eq(favoritesTable.url, url)
    ));
    return true;
  }
}
