import { SummaryState } from "@/lib/hooks/useSummaryState";
import { trpc } from "@/utils/trpc";

import { Card } from "./Card";
import { SummaryRow } from "./SummaryRow";

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
