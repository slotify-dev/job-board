import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
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

const migrationPool = new Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  max: 1,
});

const migrationDb = drizzle(migrationPool);

async function runMigrations() {
  console.log('🚀 Running migrations...');

  try {
    await migrate(migrationDb, {
      migrationsFolder: './src/database/migrations',
    });
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await migrationPool.end();
    process.exit(0);
  }
}

runMigrations();
