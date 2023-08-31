import { z } from "zod";

export const AllocationSchema = z.object({
  id: z.string(),
  amount: z.number(),
});

export const AllocationsSchema = z.object({
  allocations: z.array(AllocationSchema),
});
