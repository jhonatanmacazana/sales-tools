import { SummaryState } from "@/lib/hooks/useSummaryState";

import { Card } from "./Card";
import { SummaryRow } from "./SummaryRow";

export const Summary: React.FC<{ summaryState: SummaryState }> = ({ summaryState }) => {
  return (
    <Card title="Resumen">
      <ul className="w-full space-y-3">
        <li>
          <SummaryRow
            title="Efectivo"
            ammount={summaryState.Efectivo.ammount}
            isSelected={summaryState.Efectivo.isSelected}
          />
        </li>
        <SummaryRow
          title="Transferencia"
          ammount={summaryState.Transferencia.ammount}
          isSelected={summaryState.Transferencia.isSelected}
        />
        <SummaryRow
          title="Tarjeta"
          ammount={summaryState.Tarjeta.ammount}
          isSelected={summaryState.Tarjeta.isSelected}
        />
        <SummaryRow
          title="Yape"
          ammount={summaryState.Yape.ammount}
          isSelected={summaryState.Yape.isSelected}
        />
        <SummaryRow
          title="Plin"
          ammount={summaryState.Plin.ammount}
          isSelected={summaryState.Plin.isSelected}
        />
        <SummaryRow
          title="Otros"
          ammount={summaryState.Otros.ammount}
          isSelected={summaryState.Otros.isSelected}
        />
      </ul>
    </Card>
  );
};
