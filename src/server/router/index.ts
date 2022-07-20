import { authRouter } from "./subroutes/auth";
import { exampleRouter } from "./subroutes/example";
import { transactionRouter } from "./subroutes/transaction";
import { t } from "./trpc";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  transaction: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
