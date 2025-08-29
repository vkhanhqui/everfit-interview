import { z } from "zod";

const distanceUnitsEnum = z.enum([
  "meter",
  "centimeter",
  "inch",
  "feet",
  "yard",
]);
const temperatureUnitsEnum = z.enum(["c", "f", "k"]);

export const MetricCreateSchema = z.object({
  userId: z.uuid(),
  type: z.enum(["distance", "temperature"]),
  value: z.number(),
  unit: z.union([distanceUnitsEnum, temperatureUnitsEnum]),
  date: z.coerce.date(),
});

export type MetricCreateInput = z.infer<typeof MetricCreateSchema>;
