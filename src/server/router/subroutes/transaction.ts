import { TransactionType } from "@prisma/client";
import { z } from "zod";

import { t } from "../trpc";

export const transactionRouter = t.router({
  getByType: t.procedure
    .input(
      z.object({
        type: z.nativeEnum(TransactionType),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.transaction.findMany({
        where: { type: { equals: input.type } },
      });
    }),

  getAll: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.transaction.findMany();
  }),

  summary: t.procedure.query(async ({ ctx }) => {
    const transactions = await ctx.prisma.transaction.findMany();
    const transactionSum = transactions.reduce(
      (reducer, curr) => {
        const type = curr.type;
        reducer[type] = reducer[type] + curr.amount;
        return reducer;
      },
      {
        [TransactionType.CARD]: 0,
        [TransactionType.CASH]: 0,
        [TransactionType.OTHERS]: 0,
        [TransactionType.PLIN]: 0,
        [TransactionType.TRANSFER]: 0,
        [TransactionType.YAPE]: 0,
      }
    );
    return transactionSum;
  }),

  create: t.procedure
    .input(
      z.object({
        type: z.nativeEnum(TransactionType),
        amount: z.number(),
        description: z.string().min(0).max(400),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.transaction.create({
        data: {
          type: input.type,
          amount: input.amount,
          description: input.description,
        },
      });
    }),

  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        type: z.nativeEnum(TransactionType),
        amount: z.number(),
        description: z.string().min(0).max(400),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.transaction.update({
        where: { id: input.id },
        data: {
          type: input.type,
          amount: input.amount,
          description: input.description,
        },
      });
    }),

  delete: t.procedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.transaction.delete({
      where: { id: input },
    });
  }),
});
