import { z } from 'zod';

export const prerequisiteEdgeSchema = z.object({
  id: z.string(),
  source: z.string().optional(),
  target: z.string().optional(),
  from: z.union([z.string(), z.number()]).optional(),
  to: z.union([z.string(), z.number()]).optional(),
  type: z.string().optional(),
  label: z.string().optional(),
  sourcePage: z.string().optional(),
}).passthrough();

export type PrerequisiteEdgeData = z.infer<typeof prerequisiteEdgeSchema>;
