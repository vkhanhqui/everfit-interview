import request from "supertest";
import { v7 as uuidv7 } from "uuid";
import { ENV } from "../../seed/seeder";

describe("POST /metrics", () => {
  const basePayload = {
    userId: uuidv7(),
    type: "temperature",
    value: 1200,
    unit: "k",
    date: "2025-08-16",
  };

  it("should create a new temperature metric and return 201", async () => {
    const payload = { ...basePayload };
    const res = await request(ENV.API_BASE_URL).post("/metrics").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      userId: payload.userId,
      type: payload.type,
      value: payload.value,
      unit: payload.unit,
      date: `${payload.date}T00:00:00.000Z`,
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it("should create a new distance metric and return 201", async () => {
    const payload = { ...basePayload, type: "distance", unit: "meter" };
    const res = await request(ENV.API_BASE_URL).post("/metrics").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      userId: payload.userId,
      type: payload.type,
      value: payload.value,
      unit: payload.unit,
      date: `${payload.date}T00:00:00.000Z`,
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it("should return 400 for invalid type", async () => {
    const res = await request(ENV.API_BASE_URL)
      .post("/metrics")
      .send({
        ...basePayload,
        type: "invalid",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should return 400 for invalid unit", async () => {
    const res = await request(ENV.API_BASE_URL)
      .post("/metrics")
      .send({
        ...basePayload,
        type: "temperature",
        unit: "meter",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
