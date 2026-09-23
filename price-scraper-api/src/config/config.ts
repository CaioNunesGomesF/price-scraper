import "dotenv/config";

const host = process.env.POSTGRES_HOST ?? "localhost";
const port = process.env.POSTGRES_PORT ?? "5432";
const user = process.env.POSTGRES_USER ?? "postgres";
const password = process.env.POSTGRES_PASSWORD ?? "postgres";
const dbName = process.env.POSTGRES_DB ?? "price_scraper_db";

const backendPort = Number(process.env.BACKEND_PORT ?? 3000);

const config = {
  server: {
    port: backendPort,
    version: process.env.BACKEND_VERSION ?? "1.0.0",
  },
  encryption: {
    pepper: process.env.ENCRYPTION_PEPPER ?? "default_secret_pepper",
    masterKey:
      process.env.ENCRYPTION_MASTER_KEY ?? "12345678901234567890123456789012",
  },
  storage: {
    dir: process.env.STORAGE_DIR ?? "./data",
  },
  db: {
    host,
    port,
    user,
    password,
    db: dbName,
    url:
      process.env.DATABASE_URL ??
      `postgresql://${user}:${password}@${host}:${port}/${dbName}`,
  },
};

export default config;
