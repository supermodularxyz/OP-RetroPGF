/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from "../trpc";
import { ballotRouter } from "./ballot";

export const appRouter = router({
  ballot: ballotRouter,
});

export type AppRouter = typeof appRouter;
