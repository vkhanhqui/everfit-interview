import request from "supertest";
import { ENV, seeder } from "../../seed/seeder";
import {
  MetricType,
  DistanceUnit,
  TemperatureUnit,
  Metric,
} from "../../../services/api/src/models/Metric";
import { v7 as uuidv7 } from "uuid";

describe("GET /metrics/latestPerDay", () => {
  const metricService = seeder().getMetricService();

  it("should return latest temperature metrics in k unit", async () => {
    const userId = uuidv7();
    const latestMetrics = await seedLast7DaysLatestMetrics(
      userId,
      "temperature",
      "c",
      0,
      5
    );

    const res = await request(ENV.API_BASE_URL)
      .get("/metrics/latestPerDay")
      .query({
        userId,
        type: "temperature",
        period: "7d",
        unit: "k",
      });

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(7);

    res.body.forEach((item: any) => {
      expect(item.type).toBe("temperature");
      expect(item.unit).toBe("k");
      expect(item.value).toBe(273.15);
    });

    for (let i = 0; i < 7; i++) {
      expect(res.body[i].date).toBe(latestMetrics[i].getDate().toISOString());
      expect(res.body[i].createdAt).toBe(
        latestMetrics[i].getCreatedAt().toISOString()
      );
    }
  });

  it("should return 400 for invalid type", async () => {
    const res = await request(ENV.API_BASE_URL)
      .get("/metrics/latestPerDay")
      .query({
        userId: uuidv7(),
        type: "invalid",
        unit: "yard",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should return 400 for invalid unit", async () => {
    const res = await request(ENV.API_BASE_URL)
      .get("/metrics/latestPerDay")
      .query({
        userId: uuidv7(),
        type: "distance",
        unit: "f",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  async function seedLast7DaysLatestMetrics(
    userId: string,
    type: MetricType,
    unit: DistanceUnit | TemperatureUnit,
    value: number,
    sizeEachDay: number
  ): Promise<Metric[]> {
    const latestMetrics: Metric[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const day = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      day.setDate(today.getDate() - i);

      const metrics = await generateMetrics(
        userId,
        type,
        unit,
        value,
        sizeEachDay,
        day
      );

      latestMetrics.push(metrics[metrics.length - 1]);
    }

    return latestMetrics;
  }

  async function generateMetrics(
    userId: string,
    type: MetricType,
    unit: DistanceUnit | TemperatureUnit,
    value: number,
    size: number,
    date: Date
  ) {
    const metrics: Metric[] = [];

    for (let i = 0; i < size; i++) {
      const metric = await metricService.create({
        userId,
        type,
        value,
        unit,
        date,
      });
      await new Promise((resolve) => setTimeout(resolve, 1));
      metrics.push(metric);
    }

    return metrics;
  }
});
