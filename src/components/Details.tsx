import { useState } from "react";

import { SummaryCategory } from "@/lib/hooks/useSummaryState";
import { trpc } from "@/utils/trpc";

import { Card } from "./Card";
import { InputNumber, InputText } from "./Inputs";
import { Transaction } from "@prisma/client";
import { Spinner } from "./Spinner";

export const Details: React.FC<{
  categoryId?: SummaryCategory;
  categoryLabel?: string;
}> = ({ categoryId, categoryLabel }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(10);

  const tctx = trpc.useContext();

  const transactions = trpc.proxy.transaction.getByType.useQuery(
    { type: categoryId! },
    { enabled: Boolean(categoryId) }
  );

  const { mutate: createTransactionMutation, isLoading } =
    trpc.proxy.transaction.create.useMutation({
      onSuccess: async (newTransaction) => {
        if (!categoryId) return;

        setAmount(0);
        setDescription("");

        await Promise.all([
          tctx.queryClient.cancelQueries(["transaction.getByType"]),
          tctx.queryClient.cancelQueries(["transaction.summary"]),
        ]);

        const previousSummary = tctx.queryClient.getQueryData(["transaction.summary", null]);
        const previousTransactions = tctx.queryClient.getQueryData([
          "transaction.getByType",
          { type: categoryId },
        ]);

        tctx.queryClient.setQueryData(["transaction.summary", null], (old: any) => ({
          ...old,
          [categoryId]: old[categoryId] + newTransaction.amount,
        }));
        tctx.queryClient.setQueryData(["transaction.getByType", { type: categoryId }], (old) => [
          ...(old as Transaction[]),
          newTransaction,
        ]);

        return { previousSummary, previousTransactions };
      },
      onError: (_err, _newTodo, context: any) => {
        tctx.queryClient.setQueryData(["transaction.summary", null], context.previousSummary);
        tctx.queryClient.setQueryData(
          ["transaction.getByType", { type: categoryId }],
          context.previousTransactions
        );
      },
      onSettled: () => {
        tctx.queryClient.invalidateQueries(["transaction.summary", null]);
        tctx.queryClient.invalidateQueries(["transaction.getByType", { type: categoryId }]);
      },
    });

  const title = categoryLabel ? `Detalles - ${categoryLabel}` : "Detalles";

  return (
    <Card title={title}>
      {!categoryId && (
        <p className="text-gray-400">Seleccione una categoria para modificar o agregar detalles</p>
      )}
      {categoryId && (
        <div className="flex flex-grow flex-col">
          <div className="flex w-full flex-col gap-4 rounded-xl border border-slate-300 px-4 py-4 shadow-xl lg:flex-row">
            <InputText
              id="description"
              label="Descripción"
              placeholder="Descripción"
              value={description}
              setValue={setDescription}
            />

            <InputNumber
              className="w-2/5"
              id="amount"
              label="Monto"
              placeholder="Monto"
              value={amount}
              setValue={setAmount}
            />

            <button
              className="flex w-56 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:shadow-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={isLoading}
              onClick={() => createTransactionMutation({ amount, description, type: categoryId })}
            >
              {isLoading && <Spinner />}
              Registrar
            </button>
          </div>

          <p className="pt-4 pb-2 text-gray-400">Movimientos</p>

          <ul className="scrollbar flex max-h-60 w-full flex-grow flex-col gap-4 overflow-y-scroll rounded-xl border border-slate-300 px-4 py-4 shadow-xl">
            {transactions.data?.map((transaction) => (
              <li className="flex min-w-[2rem] gap-2" key={transaction.id}>
                <p>{transaction.description}</p>
                <p>{transaction.amount}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
