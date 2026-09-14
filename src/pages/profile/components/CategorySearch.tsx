import { useEffect, useState } from "react";

interface SearchProps{
    query: string;
    setQuery: (value: string) => void;
}
const CategorySearch: React.FC<SearchProps> = ({query, setQuery}) => {
      const [localValue, setLocalValue] = useState(query);
    useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(localValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [localValue]);
    return (
        <>
            <div className="pt-3">
                <div className="px-3">
                    <input className="form-control" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
            </div>

        </>
    );
}

export default CategorySearch;