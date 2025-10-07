import { getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away";
}

export default function Avatar({ src, alt, size = "md", status }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-32 h-32 text-2xl",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
  };

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold`}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(alt)}</span>
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} border-2 border-white dark:border-gray-800 rounded-full`}
        />
      )}
    </div>
  );
}
