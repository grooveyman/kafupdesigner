import { useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import ProfileNav from "../ProfileNav";
import CategorySearch from "../components/CategorySearch";
import CollectionContent from "./CollectionContent";


const data = [
    {
        id: 1,
        img: "https://res.cloudinary.com/dm104hogb/image/upload/v1757794303/kreationz/products/kbbgdq9ffyufsoedz8as.jpg",
        name: "Title goes here",
        category: "Collection1"
    },
    {
        id: 2,
        img: "https://res.cloudinary.com/dm104hogb/image/upload/v1757794303/kreationz/products/kbbgdq9ffyufsoedz8as.jpg",
        name: "Title goes here again",
        category: "Collection2"
    },
    {
        id: 3,
        img: "https://res.cloudinary.com/dm104hogb/image/upload/v1757794303/kreationz/products/kbbgdq9ffyufsoedz8as.jpg",
        name: "Title goes here again more",
        category: "Collection1"
    }
];

const categories = ["All", "Collection1", "Collection2"];
const CollectionWrapper: React.FC = () => {

    const [selectedCat, setSelectedCat] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const newData = data.filter((item) => {
        const matchCategory = selectedCat === "All" || item.category === selectedCat;

        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchCategory && matchSearch;
    });

    return (
        <>
            <ProfileNav />
            <div className="container">
                <div className="d-flex justify-content-between">
                    <CategoryFilter categories={categories} selectedCat={selectedCat} setSelectedCat={setSelectedCat} />
                    <CategorySearch query={searchQuery} setQuery={setSearchQuery} />
                </div>

                <div className="mt-4">
                    <CollectionContent data={newData} />
                </div>
            </div>
        </>
    );
};

export default CollectionWrapper;