export type MetricType = "distance" | "temperature";
export type DistanceUnit = "meter" | "centimeter" | "inch" | "feet" | "yard";
export type TemperatureUnit = "c" | "f" | "k";

export class Metric {
  private id: string;
  private userId: string;
  private type: MetricType;
  private value: number;
  private unit: DistanceUnit | TemperatureUnit;
  private date: Date;
  private createdAt: Date;

  constructor(
    id: string,
    userId: string,
    type: MetricType,
    value: number,
    unit: DistanceUnit | TemperatureUnit,
    date: Date,
    createdAt: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.value = value;
    this.unit = unit;
    this.date = date;
    this.createdAt = createdAt;
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getType(): string {
    return this.type;
  }

  getValue(): number {
    return this.value;
  }

  getUnit(): string {
    return this.unit;
  }

  getDate(): Date {
    return this.date;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
