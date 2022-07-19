import { authRouter } from "./subroutes/auth";
import { exampleRouter } from "./subroutes/example";
import { t } from "./trpc";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
