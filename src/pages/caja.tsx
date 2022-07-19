import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { Summary } from "@/components/Summary";
import { Details } from "@/components/Details";
import { useSummaryState, SummaryCategory } from "@/lib/hooks/useSummaryState";

const CajaPage: NextPage = () => {
  const router = useRouter();
  const { selected } = router.query;

  const { getSelectedCategory, handleSelectCategory, summaryState, unselectAll } =
    useSummaryState();

  useEffect(() => {
    if (!selected || typeof selected !== "string") return unselectAll();

    handleSelectCategory(selected as SummaryCategory);
  }, [handleSelectCategory, selected, unselectAll]);

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
          <Details categorySelected={getSelectedCategory()} />
        </div>
      </div>
    </>
  );
};

export default CajaPage;
