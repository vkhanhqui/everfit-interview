import request from "supertest";
import { ENV, seeder } from "../../seed/seeder";
import {
  MetricType,
  DistanceUnit,
  TemperatureUnit,
} from "../../../services/api/src/models/Metric";
import { v7 as uuidv7 } from "uuid";

describe("GET /metrics", () => {
  const metricService = seeder().getMetricService();

  it("should return temperature metrics in f unit", async () => {
    const userId = uuidv7();
    await generateMetrics(userId, "temperature", "c", 0, 10);

    const res = await request(ENV.API_BASE_URL).get("/metrics").query({
      userId,
      type: "temperature",
      limit: 2,
      unit: "f",
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(2);
    expect(res.body.nextCursor).toBeDefined();

    res.body.data.forEach((item: any) => {
      expect(item.type).toBe("temperature");
      expect(item.unit).toBe("f");
      expect(item.value).toBe(32);
    });
  });

  it("should return distance metrics in yard unit", async () => {
    const userId = uuidv7();
    await generateMetrics(userId, "distance", "meter", 1, 10);

    const res = await request(ENV.API_BASE_URL).get("/metrics").query({
      userId,
      type: "distance",
      limit: 2,
      unit: "yard",
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(2);
    expect(res.body.nextCursor).toBeDefined();

    res.body.data.forEach((item: any) => {
      expect(item.type).toBe("distance");
      expect(item.unit).toBe("yard");
      expect(item.value).toBeCloseTo(1.09361);
    });
  });

  it("scenario: should do pagination with cursor", async () => {
    // Create 3 records
    const userId = uuidv7();
    await generateMetrics(userId, "distance", "meter", 1, 3);

    // First page
    const payload = {
      userId,
      type: "distance",
      limit: 2,
      unit: "yard",
    };
    let res = await request(ENV.API_BASE_URL).get("/metrics").query(payload);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(2);
    expect(res.body.nextCursor).toBeDefined();

    // Last page
    res = await request(ENV.API_BASE_URL)
      .get("/metrics")
      .query({
        ...payload,
        cursor: res.body.nextCursor,
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(1);
    expect(res.body.nextCursor).toBeUndefined();
  });

  it("should return 400 for invalid type", async () => {
    const res = await request(ENV.API_BASE_URL).get("/metrics").query({
      userId: uuidv7(),
      type: "invalid",
      unit: "yard",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should return 400 for invalid unit", async () => {
    const res = await request(ENV.API_BASE_URL).get("/metrics").query({
      userId: uuidv7(),
      type: "distance",
      unit: "f",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  async function generateMetrics(
    userId: string,
    type: MetricType,
    unit: DistanceUnit | TemperatureUnit,
    value: number,
    size: number
  ) {
    const createPromises = Array.from({ length: size }, () => {
      return metricService.create({
        userId,
        type,
        value,
        unit,
        date: new Date(),
      });
    });

    const metrics = await Promise.all(createPromises);
    return metrics;
  }
});
