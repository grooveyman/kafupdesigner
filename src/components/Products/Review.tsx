import { useProductContext } from "../../context/ProductContext";
import namer from "color-namer";

export const hexToColorName = (hex: string): string => {
    const names = namer(hex);
    return names.basic[0].name;
};

const Review: React.FC = () => {


    const isDarkColor = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 < 128;
    };

    const { product } = useProductContext();
    return (
        <>
            <div className="container">

                <div className="row p-3">
                    {/* Categories review */}
                    <div className="d-flex justify-content-between">
                        <label>Category</label>
                        <a href="#">Edit</a>
                    </div>

                    <div className="text-gray-400 pt-3 pb-3">
                        {product.category.name}
                    </div>
                    <hr style={{ color: "white" }} />
                </div>

                <div className="row p-3">
                    {/* Categories review */}
                    <div className="d-flex justify-content-between">
                        <label>Product Details</label>
                        <a href="#">Edit</a>
                    </div>

                    <div className="text-gray-400 pt-3 pb-3 gap-5 d-flex flex-wrap justify-content-start">
                        <div className="flex-fill flex-md-grow-0 col-12 col-sm-6 col-md-4">
                            <label>Product Name</label>
                            <div>{product.name}</div>
                        </div>

                        <div className="flex-fill flex-md-grow-0 col-12 col-sm-6 col-md-4">
                            <label>Product Description</label>
                            <div>{product.description}</div>
                        </div>

                        <div className="flex-fill flex-md-grow-0 col-12 col-sm-6 col-md-4">
                            <label>Product Price (GHS)</label>
                            <div>{product.price}</div>
                        </div>
                    </div>
                </div>

                {/* variations */}
                <div className="row">
                    <label>Product Variations</label>
                    <div className="table-responsive py-2">
                        <table className="table table-striped text-gray text-nowrap">
                            <thead>
                                <tr>
                                    <th>Color:Size:Quantity</th>
                                    <th>Bust</th>
                                    <th>Hip</th>
                                    <th>Neck</th>
                                    <th>Sleeve</th>
                                    <th>Waist</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.variations?.map((variation) => (
                                    <tr className="variation-tr">
                                        <td>
                                            <div style={{ backgroundColor: variation.color, color: isDarkColor(variation.color) ? "#fff" : "#000", borderRadius: "20px", padding: "10px" }}>{hexToColorName(variation.color)}: {variation.size}: {variation.quantity}
                                            </div>
                                        </td>
                                        <td> <p>{variation.bust}</p></td>
                                        <td> <p>{variation.hip}</p></td>
                                        <td> <p>{variation.neck}</p></td>
                                        <td> <p>{variation.sleeve}</p></td>
                                        <td> <p>{variation.waist}</p></td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
                <div className="row">
                    <hr style={{ color: "white" }} />
                </div>


                <div className="text-gray-400 pt-3 pb-3">
                    <div className="flex justify-content-between pt-3">
                        <label>Product Images</label>
                        <a href="#">Edit</a>
                    </div>
                    <div className="pt-3">
                        <div className="preview">
                            <img className="img-fluid" height={"50%"} width={"50%"} src={
                                typeof product.previewimg == "string" ? product.previewimg : URL.createObjectURL(product.previewimg)
                            } />
                        </div>

                        <div className="d-flex justify-content-start pt-3 gap-2">
                            {product.otherimages.map((img) => (
                                <div>
                                    <img src={
                                        typeof img.url == "string" ? img.url : URL.createObjectURL(img.url)
                                    } style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>

                            ))}
                        </div>
                    </div>

                </div>
                <hr style={{ color: "white" }} />
                <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary" type="submit">Submit</button>
                </div>
            </div>
        </>
    );
}

export default Review;