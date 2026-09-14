
interface CategoryFilterProps {
    categories: string[];
    selectedCat: string;
    setSelectedCat: (category: string) => void;
}
const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCat, setSelectedCat }) => {


    return (
        <div className="container pt-3">
            <div className="category-filter px-3">
                <h5>Filter</h5>
                <div className="d-flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button key={cat} onClick={()=>setSelectedCat(cat)} className={`btn btn-sm ${selectedCat === cat ? "btn-secondary":"btn-outline-secondary"}`}>{cat}</button>

                    ))}
                    
                </div>
            </div>
        </div>

    );
};

export default CategoryFilter;