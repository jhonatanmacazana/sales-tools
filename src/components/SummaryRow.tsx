import { useRouter } from "next/router";

import { formatMoney } from "@/lib/formatMoney";

import { Link } from "./Link";

export const SummaryRow: React.FC<{
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
