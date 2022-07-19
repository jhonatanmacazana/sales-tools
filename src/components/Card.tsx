import { ReactNode } from "react";

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
