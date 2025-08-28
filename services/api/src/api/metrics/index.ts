import { Router } from "express";
import { PgMetricRepo } from "../../repositories/MetricRepo";
import { MetricServiceImp } from "../../services/MetricService";
import { MetricController } from "./MetricController";
import { MetricRoute } from "./route";
import { Pool } from "pg";

export function initMetricRoute(pool: Pool): Router {
  const repo = new PgMetricRepo(pool);
  const service = new MetricServiceImp(repo);
  const controller = new MetricController(service);
  return MetricRoute(controller);
}
