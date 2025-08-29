import { PgMetricRepo } from "../../services/api/src/repositories/MetricRepo";
import {
  MetricService,
  MetricServiceImp,
} from "../../services/api/src/services/MetricService";
import { Pool } from "pg";

export const ENV = {
  API_BASE_URL: process.env.API_BASE_URL || "",
  PG_DB_CONN_URI: process.env.PG_DB_CONN_URI,
};

const pool = new Pool({
  connectionString: process.env.PG_DB_CONN_URI,
});

export class Seeder {
  constructor(private service: MetricService) {}

  getMetricService() {
    return this.service;
  }
}

export function seeder(): Seeder {
  const repo = new PgMetricRepo(pool);
  const service = new MetricServiceImp(repo);

  return new Seeder(service);
}
