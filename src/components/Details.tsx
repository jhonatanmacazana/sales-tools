import { useState } from "react";

import { SummaryCategory } from "@/lib/hooks/useSummaryState";
import { trpc } from "@/utils/trpc";

import { Card } from "./Card";
import { InputNumber, InputText } from "./Inputs";

export const Details: React.FC<{
  categoryId?: SummaryCategory;
  categoryLabel?: string;
}> = ({ categoryId, categoryLabel }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(10);

  const { mutate: createTransactionMutation } = trpc.proxy.transaction.create.useMutation();
  const transactions = trpc.proxy.transaction.getByType.useQuery(
    { type: categoryId! },
    { enabled: Boolean(categoryId) }
  );

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
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
              onClick={() => createTransactionMutation({ amount, description, type: categoryId })}
            >
              Registrar
            </button>
          </div>

          <p className="pt-4 pb-2 text-gray-400">Movimientos</p>

          <ul className="flex w-full flex-grow flex-col gap-4 rounded-xl border border-slate-300 px-4 py-4 shadow-xl ">
            {transactions.data?.map((transaction) => (
              <li className="flex gap-2" key={transaction.id}>
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
