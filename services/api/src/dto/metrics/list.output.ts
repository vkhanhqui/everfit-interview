import { DistanceUnit, TemperatureUnit, MetricType } from "../../models/Metric";

export interface MetricListItem {
  id: string;
  type: MetricType;
  value: number;
  unit: DistanceUnit | TemperatureUnit;
  date: Date;
  createdAt: Date;
}

export interface MetricListResponse {
  data: MetricListItem[];
  nextCursor?: string;
}
