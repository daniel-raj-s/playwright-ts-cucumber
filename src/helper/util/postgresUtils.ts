import { Pool, PoolClient } from 'pg';

const {
  PROD_DB_USER,
  PROD_DB_PASSWORD,
  PROD_DB_NAME,
  PROD_DB_HOST,
  PROD_DB_PORT,
} = process.env;

if (!PROD_DB_USER || !PROD_DB_PASSWORD || !PROD_DB_NAME || !PROD_DB_HOST || !PROD_DB_PORT) {
  throw new Error('Missing one or more required DB_* environment variables');
}

const pool = new Pool({
  user: PROD_DB_USER,
  password: PROD_DB_PASSWORD,
  database: PROD_DB_NAME,
  host: PROD_DB_HOST,
  port: parseInt(PROD_DB_PORT, 10),
  max: 10,
  idleTimeoutMillis: 30000,
});

export class PostgresUtils {

  /**
   * Executes a callback within a transaction.
   * Rolls back if callback throws.
   * @param fn - Async callback receiving a client.
   */
  async withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Executes a SQL query and returns the resulting rows.
   * @param query - The SQL query string to execute.
   * @param params - Optional array of parameters for parameterized queries.
   * @returns An array of result rows.
   */
  async executeQuery(query: string, params: any[] = []): Promise<any[]> {
    const client: PoolClient = await pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } catch (error: any) {
      console.error(`Error executing query: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Fetches the first row of the result set.
   * @param query - The SQL query string.
   * @param params - Optional array of parameters.
   * @returns The first row as an object, or null if no rows.
   */
  async fetchOne<T = Record<string, unknown>>(query: string, params: unknown[] = []): Promise<T | null> {
    const rows = (await this.executeQuery(query, params)) as T[];
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Closes the connection pool. Call on shutdown.
   */
  async closePool(): Promise<void> {
    await pool.end();
  }

}