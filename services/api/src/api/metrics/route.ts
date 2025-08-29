import { Router } from "express";
import { MetricController } from "./MetricController";
import { validateMetricCreate } from "../../dto/metrics/create.input";

export function MetricRoute(controller: MetricController): Router {
  const r = Router();
  r.post("/", validateMetricCreate, controller.create);
  r.get("/", controller.list);
  r.get("/latestPerDay", controller.listLatestPerDay);
  return r;
}
