import config from "./config.js";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(config.db.url);

export default db;
