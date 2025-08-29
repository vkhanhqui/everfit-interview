import { z } from "zod";

export const MetricListLatestSchema = z.object({
  userId: z.uuid(),
  type: z.enum(["distance", "temperature"]),
  period: z.enum(["1d", "7d", "30d", "1M", "3M", "6M", "1y"]),
  unit: z.string().optional(),
});

export type MetricListLatestInput = z.infer<typeof MetricListLatestSchema>;
