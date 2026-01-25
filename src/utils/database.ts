import { Express } from "express";
import { Pool, QueryResult as PgQueryReturn, PoolClient } from 'pg';
import format from "pg-format";

export default class DatabaseUtil {

	static pool: Pool;

	static init(app: Express): void {

		const connectionString = process.env.DATABASE_URL;

		if (!connectionString) {
			throw new Error("DATABASE_URL is missing");
		}

		this.pool = new Pool({
			connectionString,
			ssl: {
				rejectUnauthorized: false
			},
			max: 10,
			connectionTimeoutMillis: 30000
		});

		this.pool.query("select now()")
			.then(res => console.log("✅ DB connected at", res.rows[0].now))
			.catch(err => console.error("❌ DB connection failed:", err));


		this.pool.on('connect', (client: PoolClient) => {
			client
				.query('SET search_path TO public')
				.catch(err => console.error('search_path error:', err));
		});
	}

	static async query(
		DatabasePool: Pool,
		query: string,
		values: (number | boolean | string | null)[],
		...formatArgs: (number | boolean | string | null)[]
	): Promise<PgQueryReturn<any>> {
		return DatabasePool.query(
			format(query, ...formatArgs),
			values
		);
	}
}
