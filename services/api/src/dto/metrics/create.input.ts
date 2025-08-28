import { z } from "zod";
import { MetricType, DistanceUnit, TemperatureUnit } from "../../models/Metric";
import { Request, Response, NextFunction } from "express";

const typeUnitMap: Map<string, string[]> = new Map([
  ["distance", ["meter", "centimeter", "inch", "feet", "yard"]],
  ["temperature", ["c", "f", "k"]],
]);

const MetricCreateSchema = z.object({
  userId: z.uuid(),
  type: z.enum(["distance", "temperature"]),
  value: z.number(),
  unit: z.string(),
  date: z.string(),
});

export class MetricCreateInput {
  userId: string;
  type: MetricType;
  value: number;
  unit: DistanceUnit | TemperatureUnit;
  date: Date;

  constructor(input: any) {
    const parsed = MetricCreateSchema.parse(input);
    this.userId = parsed.userId;
    this.type = parsed.type as MetricType;
    this.value = parsed.value;
    this.unit = parsed.unit as DistanceUnit | TemperatureUnit;
    this.date = new Date(parsed.date);
  }
}

export async function validateMetricCreate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parseResult = MetricCreateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: z.prettifyError(parseResult.error),
    });
  }

  const date = new Date(parseResult.data.date);
  if (isNaN(date.getDate())) {
    return res.status(400).json({
      error: "Invalid date format",
    });
  }

  const unit = parseResult.data.unit;
  if (!typeUnitMap.get(parseResult.data.type)?.includes(unit)) {
    return res.status(400).json({
      error: "Invalid unit for given type",
    });
  }

  next();
}
