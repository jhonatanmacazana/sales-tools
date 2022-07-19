import { useRouter } from "next/router";

import { formatMoney } from "@/lib/formatMoney";

import { Link } from "./Link";

export const SummaryRow: React.FC<{
  title: string;
  ammount: number;
  isSelected?: boolean;
}> = ({ title, ammount, isSelected }) => {
  const router = useRouter();
  const { selected } = router.query;

  return (
    <Link
      className={`flex w-full justify-between gap-2 rounded-lg px-4 py-2 text-base hover:cursor-pointer ${
        !isSelected ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-400"
      }`}
      href={selected !== title ? `/caja?selected=${title}` : "/caja"}
      shallow
    >
      <p>{title}</p>

      <div className="flex place-items-center gap-2 text-sm">
        <p>{formatMoney(ammount)}</p>
      </div>
    </Link>
  );
};
