import { Express } from "express";
import { Pool, QueryResult as PgQueryReturn, PoolClient } from 'pg';
import format from "pg-format";



export default class DatabaseUtil {

	static pool: Pool;

	static init(app:Express): void {
		this.pool = new Pool({
			host: app.get('dbHost'),
			user: app.get('dbUser'),
			password: app.get('dbPsswd'),
			port: app.get('dbPort'),
			max: 5000,
			database: app.get('dbName'),
			connectionTimeoutMillis: 30000
		});

		this.pool.on('acquire', (client: PoolClient) => {
			client.query('SET search_path TO public').catch((err: Error) => console.error('Error setting search_path:', err.stack));
		});


	}

	static async query(DatabasePool : Pool , query: string, values: (number|boolean|string|null)[], ...formatArgs: (number|boolean|string|null)[]) : Promise<PgQueryReturn<any>> {
        return new Promise<PgQueryReturn<any>>((resolve, reject) => {
            DatabasePool.query(format(query, ...formatArgs), values, (err: Error, res: PgQueryReturn<any>) => {
				if (err) {
					console.error("PG ERROR:", err);
					reject(err);
				  }
				  
				else resolve(res);
            })
        });
    }

}
