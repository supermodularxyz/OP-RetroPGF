import { z } from "zod";
import { MAX_ALLOCATION_PROJECT } from "~/components/ProjectAddToBallot";

export const AllocationSchema = z.object({
  projectId: z.string(),
  amount: z.number().max(MAX_ALLOCATION_PROJECT),
});

export const AllocationsSchema = z.object({
  allocations: z.array(AllocationSchema),
});
