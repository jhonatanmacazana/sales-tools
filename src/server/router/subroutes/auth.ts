import { t } from "../trpc";
import { protectedProcedure } from "../utils/protected-procedure";

export const authRouter = t.router({
  getSession: t.procedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(async ({ ctx }) => {
    return "You are logged in and can see this secret message!";
  }),
});
