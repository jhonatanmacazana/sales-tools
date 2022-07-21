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
    return {
      [TransactionType.CARD]: transactions
        .filter((t) => t.type === TransactionType.CARD)
        .reduce((acc, t) => acc + t.amount, 0),
      [TransactionType.CASH]: transactions
        .filter((t) => t.type === TransactionType.CASH)
        .reduce((acc, t) => acc + t.amount, 0),
      [TransactionType.OTHERS]: transactions
        .filter((t) => t.type === TransactionType.OTHERS)
        .reduce((acc, t) => acc + t.amount, 0),
      [TransactionType.PLIN]: transactions
        .filter((t) => t.type === TransactionType.PLIN)
        .reduce((acc, t) => acc + t.amount, 0),
      [TransactionType.TRANSFER]: transactions
        .filter((t) => t.type === TransactionType.TRANSFER)
        .reduce((acc, t) => acc + t.amount, 0),
      [TransactionType.YAPE]: transactions
        .filter((t) => t.type === TransactionType.YAPE)
        .reduce((acc, t) => acc + t.amount, 0),
    };
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
