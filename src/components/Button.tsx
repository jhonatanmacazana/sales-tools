export const Button: React.FC<{
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}> = ({ className, children, onClick, type }) => {
  return (
    <button
      className={`flex items-center gap-2 rounded ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
