import { Pool } from "pg";
import {
  DistanceUnit,
  Metric,
  MetricType,
  TemperatureUnit,
} from "../models/Metric";
import { MetricCreateInput, MetricListInput } from "../dto/metrics";
import { v7 as uuidv7 } from "uuid";

export interface MetricRepo {
  create(input: MetricCreateInput): Promise<Metric>;
  list(input: MetricListInput): Promise<Metric[]>;
  listLatestPerDay(input: {
    userId: string;
    type: MetricType;
    fromDate: Date;
  }): Promise<Metric[]>;
}

export class PgMetricRepo implements MetricRepo {
  constructor(private pool: Pool) {}

  async create(input: MetricCreateInput) {
    const metric = new Metric(
      uuidv7(),
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

  async list(input: MetricListInput): Promise<Metric[]> {
    let query = `
      SELECT
        id,
        user_id AS "userId",
        type,
        value,
        unit,
        date,
        created_at AS "createdAt"
      FROM metrics
      WHERE user_id = $1
        AND type = $2
    `;

    const params: any[] = [input.userId, input.type];
    const limit = input.limit || 50;
    if (input.cursor) {
      query += ` AND id < $3`;
      params.push(input.cursor);
    }

    query += `
      ORDER BY id DESC
      LIMIT $${params.length + 1}
    `;
    params.push(limit);

    const result = await this.pool.query(query, params);
    const metrics = result.rows.map(
      (row) =>
        new Metric(
          row.id,
          row.userId,
          row.type as MetricType,
          Number(row.value),
          row.unit as DistanceUnit | TemperatureUnit,
          row.date,
          row.createdAt
        )
    );
    return metrics;
  }

  async listLatestPerDay(input: {
    userId: string;
    type: MetricType;
    fromDate: Date;
  }): Promise<Metric[]> {
    const res = await this.pool.query(
      `
      SELECT DISTINCT ON (date)
        id,
        user_id AS "userId",
        type,
        value,
        unit,
        date,
        created_at AS "createdAt"
      FROM metrics
      WHERE user_id = $1
        AND type = $2
        AND date >= $3
      ORDER BY date DESC, created_at DESC
      `,
      [input.userId, input.type, input.fromDate]
    );

    return res.rows.map(
      (row: any) =>
        new Metric(
          row.id,
          row.userId,
          row.type as MetricType,
          Number(row.value),
          row.unit as DistanceUnit | TemperatureUnit,
          row.date,
          row.createdAt
        )
    );
  }
}
