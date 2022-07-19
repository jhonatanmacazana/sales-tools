import { z } from "zod";

import { t } from "../trpc";

export const exampleRouter = t.router({
  hello: t.procedure
    .input(
      z.object({
        text: z.string().nullish(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `Hola ${input?.text ?? "world"}`,
      };
    }),

  getAll: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.example.findMany();
  }),
});
