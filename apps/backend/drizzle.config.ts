import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

if (
  !process.env.PG_HOST ||
  !process.env.PG_PORT ||
  !process.env.PG_USER ||
  !process.env.PG_PASSWORD ||
  !process.env.PG_DB
) {
  throw new Error('Missing required database environment variables');
}

export default defineConfig({
  strict: true,
  verbose: true,
  dialect: 'postgresql',
  out: './src/database/migrations',
  schema: './src/database/models/*.ts',
  dbCredentials: {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT),
  },
});
