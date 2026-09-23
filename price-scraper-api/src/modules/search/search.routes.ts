import { Router } from "express";
import {
  searchController,
  getTopSearchesController,
  getCategoryAnalyticsController,
  compareController,
  getGgmaxCatalogController,
} from "./search.controller.js";

const searchRouter = Router();

searchRouter.get("/", searchController);
searchRouter.get("/analytics/top", getTopSearchesController);
searchRouter.get("/analytics/categories", getCategoryAnalyticsController);
searchRouter.get("/catalog/ggmax", getGgmaxCatalogController);
searchRouter.post("/compare", compareController);

export default searchRouter;
