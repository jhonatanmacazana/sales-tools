import { z } from "zod";

import { t } from "../trpc";

export const transactionRouter = t.router({
  get: t.procedure
    .input(
      z.object({
        text: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.transaction.findMany();
    }),

  getAll: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.example.findMany();
  }),
});
