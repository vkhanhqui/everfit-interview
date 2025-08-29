import { Router } from "express";
import { MetricController } from "./MetricController";

export function MetricRoute(controller: MetricController): Router {
  const r = Router();
  r.post("/", controller.create);
  r.get("/", controller.list);
  r.get("/latestPerDay", controller.listLatestPerDay);
  return r;
}
