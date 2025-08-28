import { Request, Response, NextFunction } from "express";
import { MetricService } from "../../services/MetricService";
import { MetricCreateInput } from "../../dto/metrics/create.input";

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
}
