import { useCallback, useState } from "react";

export const useSummaryState = () => {
  const [summaryState, setSummaryState] = useState({
    Efectivo: { ammount: 10, isSelected: false },
    Transferencia: { ammount: 10, isSelected: false },
    Tarjeta: { ammount: 10, isSelected: false },
    Yape: { ammount: 10, isSelected: false },
    Plin: { ammount: 10, isSelected: false },
    Otros: { ammount: 10, isSelected: false },
  });

  const handleSelectCategory = useCallback((category: keyof typeof summaryState) => {
    setSummaryState((old) => ({
      ...old,
      Efectivo: { ...old.Efectivo, isSelected: false },
      Transferencia: { ...old.Transferencia, isSelected: false },
      Tarjeta: { ...old.Tarjeta, isSelected: false },
      Yape: { ...old.Yape, isSelected: false },
      Plin: { ...old.Plin, isSelected: false },
      Otros: { ...old.Otros, isSelected: false },
      [category]: { ...old[category], isSelected: !old[category].isSelected },
    }));
  }, []);

  const unselectAll = useCallback(() => {
    setSummaryState((old) => ({
      ...old,
      Efectivo: { ...old.Efectivo, isSelected: false },
      Transferencia: { ...old.Transferencia, isSelected: false },
      Tarjeta: { ...old.Tarjeta, isSelected: false },
      Yape: { ...old.Yape, isSelected: false },
      Plin: { ...old.Plin, isSelected: false },
      Otros: { ...old.Otros, isSelected: false },
    }));
  }, []);

  const getSelectedCategory = useCallback(() => {
    const selectedCategory = (Object.keys(summaryState) as (keyof typeof summaryState)[]).find(
      (key) => summaryState[key].isSelected
    );
    return selectedCategory;
  }, [summaryState]);

  return { summaryState, getSelectedCategory, handleSelectCategory, unselectAll };
};

export type SummaryState = ReturnType<typeof useSummaryState>["summaryState"];

export type SummaryCategory = keyof SummaryState;
