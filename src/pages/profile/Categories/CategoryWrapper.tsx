import { useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import CategorySearch from "../components/CategorySearch";
import ProfileNav from "../ProfileNav";
import CategoryContent from "./CategoryContent";

const data = [
    {
        id: 1,
        img: "https://res.cloudinary.com/dm104hogb/image/upload/v1757794303/kreationz/products/kbbgdq9ffyufsoedz8as.jpg",
        name: "Title goes here",
        category: "category goes here"
    },
    {
        id: 2,
        img: "https://res.cloudinary.com/dm104hogb/image/upload/v1757794303/kreationz/products/kbbgdq9ffyufsoedz8as.jpg",
        name: "Title goes here again",
        category: "category goes here again"
    },
    {
        id: 3,
        img: "https://res.cloudinary.com/dm104hogb/image/upload/v1757794303/kreationz/products/kbbgdq9ffyufsoedz8as.jpg",
        name: "Title goes here again more",
        category: "Men"
    }
];

const categories = ["All", "Men", "Women"];

const CategoryWrapper: React.FC = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCat, setSelectedCat] = useState("All");

    const newData = data.filter((item) => {
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchCategory = selectedCat === "All" || item.category === selectedCat;

        return matchCategory && matchSearch;
    });
    ;

    return (
        <>
            <ProfileNav />
            <div className="container">
                <div className="d-flex justify-content-between">
                    <CategoryFilter categories={categories} selectedCat={selectedCat} setSelectedCat={setSelectedCat} />
                    <CategorySearch query={searchQuery} setQuery={setSearchQuery} />
                </div>

                <div className="mt-4">
                    <CategoryContent data={newData} />
                </div>
            </div>
        </>
    );
}

export default CategoryWrapper;