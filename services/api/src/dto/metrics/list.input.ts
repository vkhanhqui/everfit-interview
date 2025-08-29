import { z } from "zod";

export const MetricListSchema = z.object({
  userId: z.uuid(),
  type: z.enum(["distance", "temperature"]),
  cursor: z.uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  unit: z.string().optional(),
});

export type MetricListInput = z.infer<typeof MetricListSchema>;
