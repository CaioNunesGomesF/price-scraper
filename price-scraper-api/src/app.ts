import path from "path";
import express, { type Request, type Response } from "express";
import cors from "cors";
import config from "./config/config.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import searchRouter from "./modules/search/search.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import favRouter from "./modules/favorites/favorites.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    api: "Price Scraper API",
    status: "online",
    version: config.server.version,
    timestamp: new Date(),
  });
});

app.use("/api/v1/search", searchRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/favorites", favRouter);

app.use(errorHandler);

export default app;
