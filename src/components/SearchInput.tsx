import { Search } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    ariaLabel?: string;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = "Search",
    ariaLabel,
    className = "",
}) => (
    <div className={`kf-search ${className}`.trim()}>
        <Search size={16} aria-hidden="true" />
        <input
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label={ariaLabel ?? placeholder}
        />
    </div>
);

export default SearchInput;