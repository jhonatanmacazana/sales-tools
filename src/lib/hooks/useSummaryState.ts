import { useCallback, useState } from "react";

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
