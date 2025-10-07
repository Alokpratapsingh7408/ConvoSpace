import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-2.5 bg-[#202c33] border-none rounded-lg focus:ring-0 text-white placeholder-gray-500 text-sm"
      />
    </div>
  );
}
