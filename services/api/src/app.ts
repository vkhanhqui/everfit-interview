import express, { Application } from "express";
import { initMetricRoute } from "./api";
import { Pool } from "pg";

const app: Application = express();

export const initialize = async (): Promise<void> => {
  const pool = new Pool({
    connectionString: process.env.PG_DB_CONN_URI,
  });

  const metrics = initMetricRoute(pool);

  app.use(express.json());
  app.use("/metrics", metrics);
};

export default app;
