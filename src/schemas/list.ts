import { z } from "zod";
import { OP_TO_ALLOCATE } from "~/components/BallotOverview";

export const CreateListSchema = z.object({
  listName: z.string().min(1),
  listDescription: z.string().min(1),
  impactEvaluationLink: z.string().url().nullish(),
  impactEvaluationDescription: z.string(),
  allocations: z
    .array(z.object({ id: z.string(), amount: z.number().min(1) }))
    .min(1)
    .refine(
      (val) => {
        const sum = val.reduce((acc, x) => acc + x.amount, 0);
        return sum > 0 && sum <= OP_TO_ALLOCATE;
      },
      { message: "Total amount OP is more than maximum" }
    ),
});

export type CreateList = z.infer<typeof CreateListSchema>;
