interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function IconButton({
  icon,
  onClick,
  variant = "ghost",
  size = "md",
  className = "",
}: IconButtonProps) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400",
  };

  const sizes = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-lg transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon}
    </button>
  );
}
