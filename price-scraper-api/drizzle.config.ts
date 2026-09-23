import { defineConfig } from 'drizzle-kit';
import config from './src/config/config.js';

export default defineConfig({
  out: './drizzle',
  schema: './src/**/*.schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.db.url,
  },
});
