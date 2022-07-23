import { Transaction } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

import { Button } from "@/components/Button";
import { InputNumber, InputText } from "@/components/Inputs";
import { Link } from "@/components/Link";
import { Spinner } from "@/components/Spinner";

import { trpc } from "@/utils/trpc";

export const formatMoney = (money: number) => `S/. ${money.toFixed(2)}`;

const SummaryRow: React.FC<{
  id: string;
  title: string;
  amount: number;
  isSelected?: boolean;
}> = ({ id, title, amount, isSelected }) => {
  const router = useRouter();
  const { selected } = router.query;

  return (
    <Link
      className={`flex w-full justify-between gap-2 rounded-lg px-4 py-2 text-base hover:cursor-pointer ${
        !isSelected ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-400"
      }`}
      href={selected !== id ? `/caja?selected=${id}` : "/caja"}
      replace
      shallow
    >
      <p>{title}</p>

      <div className="flex place-items-center gap-2 text-sm">
        <p>{formatMoney(amount)}</p>
      </div>
    </Link>
  );
};

export const Card: React.FC<{
  children: ReactNode;
  title: string;
}> = ({ children, title }) => {
  return (
    <div className="flex min-h-[15rem] w-full flex-col rounded-xl border border-gray-700 bg-gray-800 px-4 py-4 shadow-lg ring-1 ring-slate-900/5 ">
      <h3 className="pb-2 text-center text-2xl">{title}</h3>

      <hr className="py-2" />

      <div className="text-md flex grow flex-col items-center justify-center gap-2 break-words text-center">
        {children}
      </div>
    </div>
  );
};

export const Summary: React.FC<{ summaryState: SummaryState }> = ({ summaryState }) => {
  const summary = trpc.proxy.transaction.summary.useQuery();

  if (summary.isLoading) return <div>Loading...</div>;

  if (summary.isError) return <div>Error</div>;

  return (
    <Card title="Resumen">
      <ul className="w-full space-y-3">
        <li>
          <SummaryRow
            id="CASH"
            title={summaryState.CASH.label}
            amount={summary.data!.CASH}
            isSelected={summaryState.CASH.isSelected}
          />
        </li>
        <li>
          <SummaryRow
            id="TRANSFER"
            title={summaryState.TRANSFER.label}
            amount={summary.data!.TRANSFER}
            isSelected={summaryState.TRANSFER.isSelected}
          />
        </li>
        <li>
          <SummaryRow
            id="CARD"
            title={summaryState.CARD.label}
            amount={summary.data!.CARD}
            isSelected={summaryState.CARD.isSelected}
          />
        </li>
        <li>
          <SummaryRow
            id="YAPE"
            title={summaryState.YAPE.label}
            amount={summary.data!.YAPE}
            isSelected={summaryState.YAPE.isSelected}
          />
        </li>
        <li>
          <SummaryRow
            id="PLIN"
            title={summaryState.PLIN.label}
            amount={summary.data!.PLIN}
            isSelected={summaryState.PLIN.isSelected}
          />
        </li>
        <li>
          <SummaryRow
            id="OTHERS"
            title={summaryState.OTHERS.label}
            amount={summary.data!.OTHERS}
            isSelected={summaryState.OTHERS.isSelected}
          />
        </li>
      </ul>
    </Card>
  );
};

export const Details: React.FC<{
  categoryId?: SummaryCategory;
  categoryLabel?: string;
}> = ({ categoryId, categoryLabel }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);

  const tctx = trpc.useContext();

  const transactions = trpc.proxy.transaction.getByType.useQuery(
    { type: categoryId! },
    { enabled: Boolean(categoryId) }
  );

  const { mutate: deleteMutation } = trpc.proxy.transaction.delete.useMutation({
    onSuccess: async (transactionDeleted) => {
      if (!categoryId) return;
      tctx.queryClient.setQueryData(["transaction.summary", null], (old: any) => ({
        ...old,
        [categoryId]: old[categoryId] - transactionDeleted.amount,
      }));
      tctx.queryClient.setQueryData(["transaction.getByType", { type: categoryId }], (old) =>
        (old as Transaction[]).filter((t) => t.id !== transactionDeleted.id)
      );
    },
  });

  const { mutate: createTransactionMutation, isLoading: isCreateMutationLoading } =
    trpc.proxy.transaction.create.useMutation({
      onSuccess: async (newTransaction) => {
        if (!categoryId) return;

        setAmount(0);
        setDescription("");

        tctx.queryClient.setQueryData(["transaction.summary", null], (old: any) => ({
          ...old,
          [categoryId]: old[categoryId] + newTransaction.amount,
        }));
        tctx.queryClient.setQueryData(["transaction.getByType", { type: categoryId }], (old) => [
          ...(old as Transaction[]),
          newTransaction,
        ]);
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
            <InputNumber
              className="w-2/5"
              id="amount"
              label="Monto"
              placeholder="Monto"
              value={amount}
              setValue={setAmount}
            />

            <InputText
              id="description"
              label="Descripción"
              placeholder="Descripción"
              value={description}
              setValue={setDescription}
            />

            <button
              className="flex w-56 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:shadow-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={isCreateMutationLoading}
              onClick={() => createTransactionMutation({ amount, description, type: categoryId })}
            >
              {isCreateMutationLoading && <Spinner />}
              Registrar
            </button>
          </div>

          <p className="pt-4 pb-2 text-gray-400">Movimientos</p>

          <ul className="scrollbar flex max-h-60 w-full flex-grow flex-col gap-4 overflow-y-scroll rounded-xl border border-slate-300 px-4 py-4 shadow-xl">
            {transactions.data?.map((transaction) => (
              <li className="min-w-20 flex items-center justify-between gap-2" key={transaction.id}>
                <p>{`${formatMoney(transaction.amount)} ${transaction.description || "-"}`}</p>

                <div className="flex items-center justify-center">
                  <Button className="text-md p-1 text-slate-500 hover:bg-gray-700">
                    <MdEdit />
                  </Button>

                  <Button
                    className="text-md p-1 text-red-500 hover:bg-gray-700"
                    onClick={() => deleteMutation(transaction.id)}
                  >
                    <MdDelete />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export const useSummaryState = () => {
  const [summaryState, setSummaryState] = useState({
    CASH: { label: "Efectivo", amount: 10, isSelected: false },
    TRANSFER: { label: "Transferencia", amount: 10, isSelected: false },
    CARD: { label: "Tarjeta", amount: 10, isSelected: false },
    YAPE: { label: "Yape", amount: 10, isSelected: false },
    PLIN: { label: "Plin", amount: 10, isSelected: false },
    OTHERS: { label: "Otros", amount: 10, isSelected: false },
  });

  const handleSelectCategory = useCallback((category: keyof typeof summaryState) => {
    setSummaryState((old) => ({
      ...old,
      CASH: { ...old.CASH, isSelected: false },
      TRANSFER: { ...old.TRANSFER, isSelected: false },
      CARD: { ...old.CARD, isSelected: false },
      YAPE: { ...old.YAPE, isSelected: false },
      PLIN: { ...old.PLIN, isSelected: false },
      OTHERS: { ...old.OTHERS, isSelected: false },
      [category]: { ...old[category], isSelected: !old[category].isSelected },
    }));
  }, []);

  const unselectAll = useCallback(() => {
    setSummaryState((old) => ({
      ...old,
      CASH: { ...old.CASH, isSelected: false },
      TRANSFER: { ...old.TRANSFER, isSelected: false },
      CARD: { ...old.CARD, isSelected: false },
      YAPE: { ...old.YAPE, isSelected: false },
      PLIN: { ...old.PLIN, isSelected: false },
      OTHERS: { ...old.OTHERS, isSelected: false },
    }));
  }, []);

  const getSelectedCategory = useCallback(() => {
    const selectedCategory = (Object.keys(summaryState) as (keyof typeof summaryState)[]).find(
      (key) => summaryState[key].isSelected
    );

    if (!selectedCategory) return null;
    return { ...summaryState[selectedCategory], id: selectedCategory };
  }, [summaryState]);

  return { summaryState, getSelectedCategory, handleSelectCategory, unselectAll };
};

export type SummaryState = ReturnType<typeof useSummaryState>["summaryState"];

export type SummaryCategory = keyof SummaryState;

const CajaPage: NextPage = () => {
  const router = useRouter();
  const { selected } = router.query;

  const { getSelectedCategory, handleSelectCategory, summaryState, unselectAll } =
    useSummaryState();

  useEffect(() => {
    if (!selected || typeof selected !== "string") return unselectAll();

    handleSelectCategory(selected as SummaryCategory);
  }, [handleSelectCategory, selected, unselectAll]);

  const category = getSelectedCategory();
  return (
    <>
      <Head>
        <title>Herramientas de venta - Caja</title>
        <meta name="description" content="Herramientas de venta - caja" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen w-screen flex-col items-center justify-center overflow-y-scroll p-4">
        <h2 className="text-4xl font-extrabold text-purple-300 md:text-7xl">CAJA</h2>

        <p className="pb-8 text-lg text-gray-300 md:text-2xl">Registre las transacciones de hoy</p>

        <div className="flex w-11/12 flex-col gap-12 lg:w-5/6 lg:flex-row xl:w-4/5 ">
          <Summary summaryState={summaryState} />
          <Details categoryId={category?.id} categoryLabel={category?.label} />
        </div>
      </div>
    </>
  );
};

export default CajaPage;
