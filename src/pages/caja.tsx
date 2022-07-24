import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Transaction, TransactionType } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

import LoadingSVG from "@/assets/puff.svg";
import { Button } from "@/components/Button";
import { InputNumber, InputText } from "@/components/Inputs";
import { Link } from "@/components/Link";
import { Spinner } from "@/components/Spinner";
import { trpc } from "@/utils/trpc";

const formatMoney = (money: number) => `S/. ${money.toFixed(2)}`;
const objectKeys = <T,>(obj: T) => Object.keys(obj) as Array<keyof T>;

const SummaryRow: React.FC<{
  id: string;
  title: string;
  amount: number;
  isSelected?: boolean;
}> = ({ id, title, amount, isSelected }) => {
  return (
    <Link
      className={`flex w-full justify-between gap-2 rounded-lg px-4 py-2 text-base hover:cursor-pointer ${
        !isSelected ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-400"
      }`}
      href={isSelected ? "/caja" : `/caja?selected=${id}`}
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

const Card: React.FC<{
  children: ReactNode;
  title: string;
}> = ({ children, title }) => {
  return (
    <div className="flex min-h-[15rem] w-full flex-col rounded-xl border border-gray-700 bg-gray-800 px-4 py-4 shadow-lg ring-1 ring-slate-900/5">
      <h3 className="pb-2 text-center text-2xl">{title}</h3>

      <div className="text-md flex grow flex-col items-center justify-center gap-2 break-words text-center">
        {children}
      </div>
    </div>
  );
};

const useSummaryState = () => {
  const [summaryState, setSummaryState] = useState({
    [TransactionType.CASH]: { label: "Efectivo", isSelected: false },
    [TransactionType.TRANSFER]: { label: "Transferencia", isSelected: false },
    [TransactionType.CARD]: { label: "Tarjeta", isSelected: false },
    [TransactionType.YAPE]: { label: "Yape", isSelected: false },
    [TransactionType.PLIN]: { label: "Plin", isSelected: false },
    [TransactionType.OTHERS]: { label: "Otros", isSelected: false },
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
    const selectedCategory = objectKeys(summaryState).find((key) => summaryState[key].isSelected);

    if (!selectedCategory) return null;
    return { ...summaryState[selectedCategory], id: selectedCategory };
  }, [summaryState]);

  return { summaryState, getSelectedCategory, handleSelectCategory, unselectAll };
};

type SummaryState = ReturnType<typeof useSummaryState>["summaryState"];
type SummaryCategory = keyof SummaryState;

const Summary: React.FC<{ summaryState: SummaryState }> = ({ summaryState }) => {
  const [animationParent] = useAutoAnimate<HTMLUListElement>();
  const summary = trpc.proxy.transaction.summary.useQuery();

  if (summary.isLoading)
    return (
      <div className="flex animate-fade-in-delay justify-center p-8">
        <Image src={LoadingSVG} alt="loading..." width={200} height={200} />
      </div>
    );

  if (summary.isError) return <div>Error</div>;
  if (!summary.data) return <div>Error</div>;

  const summaryKeys = objectKeys(summary.data);
  const summaryTotal = summaryKeys.reduce((acc, curr) => acc + summary.data[curr], 0);

  return (
    <Card title="Resumen">
      <div className="pb-2" />

      <ul className="w-full space-y-3" ref={animationParent}>
        {objectKeys(summary.data).map((summaryItem) => (
          <li key={summaryItem}>
            <SummaryRow
              amount={summary.data[summaryItem]}
              id={summaryItem}
              title={summaryState[summaryItem].label}
              isSelected={summaryState[summaryItem].isSelected}
            />
          </li>
        ))}
      </ul>

      <div className="pb-2" />

      <div className="flex w-full justify-between gap-2">
        <div className="flex w-full flex-col justify-between gap-2 rounded-lg border border-gray-600 p-2 text-base text-gray-500">
          <p>Según el sistema ...</p>
          <p className="text-sm">{formatMoney(summaryTotal)}</p>
        </div>
        <div className="flex w-full flex-col  justify-between gap-2 rounded-lg border border-gray-600 p-2 text-base text-gray-500">
          <p>Realmente ...</p>
          <p className="text-sm">{formatMoney(summaryTotal)}</p>
        </div>
        <div className="flex w-full flex-col  justify-center gap-2 rounded-lg border border-gray-600 p-2 text-base text-gray-500">
          <p>{`${"Sobran"} ${0}`}</p>
        </div>
      </div>
    </Card>
  );
};

const Details: React.FC<{
  categoryId?: SummaryCategory;
  categoryLabel?: string;
}> = ({ categoryId, categoryLabel }) => {
  const [animationParent] = useAutoAnimate<HTMLUListElement>();
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

  const title = categoryLabel ? `Detalles - ${categoryLabel}` : "Detalles";

  return (
    <Card title={title}>
      {!categoryId && (
        <p className="text-gray-400">Seleccione una categoria para modificar o agregar detalles</p>
      )}

      {categoryId && (
        <ul
          className="scrollbar flex h-4/5 w-full  flex-col gap-4 overflow-y-scroll rounded-xl border border-slate-300 px-4 py-4 shadow-xl"
          ref={animationParent}
        >
          {transactions.data?.map((transaction) => (
            <li className="flex min-w-full items-center justify-between gap-2" key={transaction.id}>
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
      )}
    </Card>
  );
};

const TransactionForm: React.FC<{ categoryId?: SummaryCategory }> = ({ categoryId }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);

  const tctx = trpc.useContext();

  const { mutate: createTransactionMutation, isLoading: isCreateMutationLoading } =
    trpc.proxy.transaction.create.useMutation({
      onSuccess: async (newTransaction) => {
        if (!categoryId) return;
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
        setAmount(0);
        setDescription("");
        tctx.queryClient.invalidateQueries(["transaction.summary", null]);
        tctx.queryClient.invalidateQueries(["transaction.getByType", { type: categoryId }]);
      },
    });

  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-xl border border-slate-300 px-4 py-4 shadow-xl">
      <div className="flex w-full flex-col gap-4 shadow-xl lg:flex-row">
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
      </div>

      <div className="flex w-full justify-center">
        <button
          className="flex w-48 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-800 disabled:text-gray-400 disabled:shadow-none"
          disabled={isCreateMutationLoading || !categoryId}
          onClick={() => createTransactionMutation({ amount, description, type: categoryId! })}
        >
          {isCreateMutationLoading && <Spinner />}
          Registrar
        </button>
      </div>
    </div>
  );
};

const CajaPage: NextPage = () => {
  const router = useRouter();
  const { selected } = router.query;

  const { getSelectedCategory, handleSelectCategory, summaryState, unselectAll } =
    useSummaryState();

  useEffect(() => {
    if (!selected || typeof selected !== "string") return unselectAll();
    if (!(selected in TransactionType)) return unselectAll();
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

      <main className="flex min-h-screen w-screen flex-col items-center justify-center overflow-y-scroll p-4">
        <h2 className="text-4xl font-extrabold text-purple-300 md:text-7xl">CAJA</h2>

        <p className="pb-8 text-lg text-gray-300 md:text-2xl">Registre las transacciones de hoy</p>

        <div className="flex w-11/12 lg:w-5/6 lg:flex-row xl:w-4/5 ">
          <TransactionForm categoryId={category?.id} />
        </div>

        <div className="pb-8" />

        <div className="flex w-11/12 flex-col gap-12 lg:w-5/6 lg:flex-row xl:w-4/5 ">
          <Summary summaryState={summaryState} />
          <Details categoryId={category?.id} categoryLabel={category?.label} />
        </div>
      </main>
    </>
  );
};

export default CajaPage;
