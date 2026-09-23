import type { Response, NextFunction } from "express";
import { FavoritesService } from "./favorites.service.js";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

const favService = new FavoritesService();

export async function getFavoritesController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const list = await favService.getFavorites(userId);
    // Convert numeric strings back to floats for frontend compatibility
    const formatted = list.map(f => ({
      ...f,
      price: parseFloat(f.price),
      rating: f.rating ? parseFloat(f.rating) : undefined,
    }));
    return res.json({ status: "success", data: formatted });
  } catch (err) {
    next(err);
  }
}

export async function addFavoriteController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const data = req.body;
    const added = await favService.addFavorite(userId, data);
    return res.status(201).json({ status: "success", data: added });
  } catch (err) {
    next(err);
  }
}

export async function removeFavoriteController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const url = req.body.url;
    await favService.removeFavorite(userId, url);
    return res.json({ status: "success" });
  } catch (err) {
    next(err);
  }
}
