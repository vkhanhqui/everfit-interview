import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { MetricService } from "../../services/MetricService";
import {
  MetricCreateSchema,
  MetricListSchema,
  MetricListLatestSchema,
} from "../../dto/metrics";

const typeUnitMap: Map<string, string[]> = new Map([
  ["distance", ["meter", "centimeter", "inch", "feet", "yard"]],
  ["temperature", ["c", "f", "k"]],
]);

export class MetricController {
  constructor(private service: MetricService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = MetricCreateSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: z.prettifyError(parseResult.error),
        });
      }

      const validation = this.validateMetricUnit(
        parseResult.data.type,
        parseResult.data.unit
      );
      if (validation.error) {
        return res.status(400).json(validation);
      }

      const metric = await this.service.create(parseResult.data);
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

      const validation = this.validateMetricUnit(
        parseResult.data.type,
        parseResult.data.unit
      );
      if (validation.error) {
        return res.status(400).json(validation);
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

      const validation = this.validateMetricUnit(
        parseResult.data.type,
        parseResult.data.unit
      );
      if (validation.error) {
        return res.status(400).json(validation);
      }

      const result = await this.service.listLatestPerDay(parseResult.data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  private validateMetricUnit(type: string, unit?: string) {
    if (!unit) {
      return {};
    }

    if (!typeUnitMap.get(type)?.includes(unit)) {
      return {
        error: "Invalid unit for given type",
      };
    }

    return {};
  }
}
