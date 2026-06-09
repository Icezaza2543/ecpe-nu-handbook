import { Search } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBox({ value, onChange, placeholder = 'ค้นหารหัสวิชา หรือ ชื่อวิชา...' }: SearchBoxProps) {
  return (
    <label className="search-box">
      <Search size={18} aria-hidden="true" />
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
