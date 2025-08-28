import { Pool } from "pg";
import { Metric } from "../models/Metric";
import { MetricCreateInput } from "../dto/metrics/create.input";
import { v4 as uuidv4 } from "uuid";

export interface MetricRepo {
  create(input: MetricCreateInput): Promise<Metric>;
}

export class PgMetricRepo implements MetricRepo {
  constructor(private pool: Pool) {}

  async create(input: MetricCreateInput) {
    const metric = new Metric(
      uuidv4(),
      input.userId,
      input.type,
      input.value,
      input.unit,
      input.date,
      new Date()
    );

    await this.pool.query(
      `
      INSERT INTO metrics (
        id,
        user_id,
        type,
        value,
        unit,
        date,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        metric.getId(),
        metric.getUserId(),
        metric.getType(),
        metric.getValue(),
        metric.getUnit(),
        metric.getDate(),
        metric.getCreatedAt(),
      ]
    );
    return metric;
  }
}
