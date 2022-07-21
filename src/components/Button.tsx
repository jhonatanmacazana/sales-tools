import { ReactNode } from "react";

export const Button: React.FC<{
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}> = ({ className, children, onClick }) => {
  return (
    <button
      className={`flex items-center gap-2 rounded ${
        className || "bg-gray-200 px-4 py-2 text-xl text-black"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
