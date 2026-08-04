import { Pool } from 'pg';

let poolInstance: Pool | null = null;

export function getDatabasePool(): Pool {
  if (!poolInstance) {
    const connectionString = process.env.DATABASE_URL;

    if (connectionString) {
      poolInstance = new Pool({
        connectionString,
        ssl: {
          // Required for Azure Database for PostgreSQL
          rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
        },
      });
    } else {
      // Fallback to discrete environmental configurations
      const host = process.env.DB_HOST;
      const user = process.env.DB_USER;
      const password = process.env.DB_PASSWORD;
      const database = process.env.DB_NAME || 'postgres';
      const port = Number(process.env.DB_PORT) || 5432;

      if (!host || !user || !password) {
        throw new Error(
          'Database connection configurations (DATABASE_URL or DB_HOST/DB_USER/DB_PASSWORD) are missing.'
        );
      }
//
      poolInstance = new Pool({
        host,
        port,
        user,
        password,
        database,
        ssl: {
          rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
        },
      });
    }

    // Log connection test
    poolInstance.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.error('❌ Failed to establish connection to Azure Database for PostgreSQL:', err.message);
      } else {
        console.log('✅ Successfully connected to Azure Database for PostgreSQL at:', res.rows[0].now);
      }
    });
  }

  return poolInstance;
}