import { Router } from "express";
import { getFavoritesController, addFavoriteController, removeFavoriteController } from "./favorites.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const favRouter = Router();

favRouter.use(authMiddleware);
favRouter.get("/", getFavoritesController);
favRouter.post("/", addFavoriteController);
favRouter.delete("/", removeFavoriteController);

export default favRouter;
