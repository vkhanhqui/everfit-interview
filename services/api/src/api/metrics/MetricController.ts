import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { MetricService } from "../../services/MetricService";
import {
  MetricCreateInput,
  MetricListSchema,
  MetricListLatestSchema,
} from "../../dto/metrics";

export class MetricController {
  constructor(private service: MetricService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metricIn = new MetricCreateInput(req.body);
      const metric = await this.service.create(metricIn);
      res.status(201).json(metric);
    } catch (err: any) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = MetricListSchema.safeParse(req.query);
      if (!parseResult.success) {
        return res.status(400).json({
          error: z.prettifyError(parseResult.error),
        });
      }

      const result = await this.service.list(parseResult.data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  listLatestPerDay = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parseResult = MetricListLatestSchema.safeParse(req.query);
      if (!parseResult.success) {
        return res.status(400).json({
          error: z.prettifyError(parseResult.error),
        });
      }

      const result = await this.service.listLatestPerDay(parseResult.data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}
