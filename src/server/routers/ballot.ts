import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/prisma";

const VoteSchema = z.object({
  // id: z.string().uuid().optional(),
  projectId: z.string(),
  amount: z.number(),
});
/**
 * Default selector for Ballot.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultBallotSelect = Prisma.validator<Prisma.BallotSelect>()({
  id: true,
  user: true,
  submitted: true,
  votes: true,
  createdAt: true,
  updatedAt: true,
});

export const ballotRouter = router({
  get: protectedProcedure.query(({ ctx }) => {
    return prisma.ballot.findFirst({
      where: { user: ctx.user.name! },
      select: defaultBallotSelect,
    });
  }),
  save: protectedProcedure
    .input(
      z.object({ id: z.string().uuid().optional(), votes: z.array(VoteSchema) })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await checkBallotSubmitted(ctx.user.name!);
      if (existing) {
        return prisma.ballot.update({
          where: { id: existing?.id },
          data: { votes: { deleteMany: {}, create: input.votes } },
        });
      }
      const ballot = await prisma.ballot.create({
        data: {
          votes: { create: input.votes },
          submitted: false,
          user: ctx.user.name!,
        },

        select: defaultBallotSelect,
      });
      return ballot;
    }),
  submit: protectedProcedure
    .input(z.object({ votes: z.array(VoteSchema) }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.user.name!;
      const existing = await checkBallotSubmitted(user);

      const ballot = await prisma.ballot.update({
        where: { id: existing?.id },
        data: { submitted: true },
        select: defaultBallotSelect,
      });
      return ballot;
    }),
});

async function checkBallotSubmitted(user: string) {
  const existing = await prisma.ballot.findFirst({
    where: { user },
  });
  if (existing?.submitted) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Ballot already submitted",
    });
  }
  return existing;
}
