import { z } from "zod";
import { MAX_ALLOCATION_TOTAL } from "~/components/BallotOverview";

export const CreateListSchema = z.object({
  listName: z.string().min(1),
  listDescription: z.string().min(1),
  impactEvaluationLink: z.union([z.string().url(), z.literal("").default("")]),
  impactEvaluationDescription: z.string().min(1),
  impactCategory: z.string().array(),
  allocations: z
    .array(z.object({ projectId: z.string(), amount: z.number().min(0) }))
    .min(1)
    .refine(
      (val) => {
        const sum = val.reduce((acc, x) => acc + x.amount, 0);
        return sum >= 0 && sum <= MAX_ALLOCATION_TOTAL;
      },
      { message: "Total amount OP is more than maximum" }
    ),
});

export type CreateList = z.infer<typeof CreateListSchema>;
