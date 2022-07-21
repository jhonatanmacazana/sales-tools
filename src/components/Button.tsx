import { ReactNode } from "react";

export const Button: React.FC<{
  children: ReactNode;
  onClick: () => void;
}> = ({ children, onClick }) => {
  return (
    <button
      className="flex items-center gap-2 rounded bg-gray-200 px-4 py-2 text-xl text-black"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
