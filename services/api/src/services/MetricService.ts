import { MetricRepo } from "../repositories/MetricRepo";
import {
  MetricCreateInput,
  MetricListInput,
  MetricListResponse,
  MetricListItem,
  MetricListLatestInput,
} from "../dto/metrics";
import { Metric, DistanceUnit, TemperatureUnit } from "../models/Metric";
import { convertValue } from "../utils/metrics/metricConverter";
import { getFromDate } from "../utils/metrics/periodConverter";

export interface MetricService {
  create(input: MetricCreateInput): Promise<Metric>;
  list(input: MetricListInput): Promise<MetricListResponse>;
  listLatestPerDay(input: MetricListLatestInput): Promise<MetricListItem[]>;
}

export class MetricServiceImp implements MetricService {
  constructor(private repo: MetricRepo) {}

  async create(input: MetricCreateInput) {
    return this.repo.create(input);
  }

  async list(input: MetricListInput): Promise<MetricListResponse> {
    const metrics = await this.repo.list(input);
    const items = this.toMetricItems(metrics, input.unit);
    const nextCursor =
      metrics.length === input.limit
        ? metrics[metrics.length - 1].getId()
        : undefined;
    return {
      data: items,
      nextCursor,
    };
  }

  async listLatestPerDay(
    input: MetricListLatestInput
  ): Promise<MetricListItem[]> {
    const fromDate = getFromDate(input.period);
    const metrics = await this.repo.listLatestPerDay({
      userId: input.userId,
      type: input.type,
      fromDate,
    });
    return this.toMetricItems(metrics, input.unit);
  }

  private toMetricItems(metrics: Metric[], toUnit?: string): MetricListItem[] {
    const res = metrics.map((metric) => {
      let value = metric.getValue();
      let curUnit = metric.getUnit();

      if (toUnit) {
        value = convertValue(metric.getType(), curUnit, toUnit, value);
        curUnit = toUnit as DistanceUnit | TemperatureUnit;
      }

      return {
        id: metric.getId(),
        type: metric.getType(),
        value,
        unit: curUnit,
        date: metric.getDate(),
        createdAt: metric.getCreatedAt(),
      };
    });

    return res;
  }
}
