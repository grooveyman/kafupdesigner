import { DeleteIcon, LucideGitCompareArrows, Trash2 } from "lucide-react";
import { FaFontAwesome, FaTrash } from "react-icons/fa";

interface Item {
    id: number;
    name: string;
    img: string;
    category: string;
}

interface ContentProps {
    data: Item[];
}

const CategoryContent: React.FC<ContentProps> = ({ data }) => {
    console.log(data);
    return (
        <>
            <div className="container">
                <div className="d-flex flex-wrap gap-2">

                    {data.length === 0 ? (
                        <p>No results found</p>
                    ) : (
                        data.map((item) => (
                            <div key={item.id} className="flex-shrink-0" style={{ width: "300px", marginBottom: "10px" }}>
                                <div className="w-full">
                                    <div className="relative">
                                        <img
                                            className="w-full h-[250px] object-cover rounded bg-white"
                                            src={item.img}
                                            alt={item.name}
                                        />


                                        <button
                                            className="absolute top-2 right-2 bg-black/80 text-white hover:bg-gray-500 hover:text-white p-2 rounded-full shadow transition"
                                            onClick={() => console.log("delete clicked")}
                                        >
                                            <LucideGitCompareArrows fill="white" size={18} />
                                        </button>
                                    </div>

                                    <div className="feat-desc mt-3">
                                        <p>{item.name}</p>
                                        <p className="feat-cat">{item.category}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </>
    );
}

export default CategoryContent;