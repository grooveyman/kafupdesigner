import { useEffect, useState } from "react";

interface ScrollNavProps{
    prodname:string;
    prodamount:number;
}
const ProductScrollNav: React.FC<ScrollNavProps> = ({prodname, prodamount}) => {
    const [visisble, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 50) //show after 100px
            console.log("scrolled");
        };

        window.addEventListener("scroll", handleScroll);


        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!visisble) return null;
    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    background: "#111",
                    color: "#fff",
                    padding: "10px 20px",
                    zIndex: 1000,
                }}
            >
                <div className="container px-3">
                <div className="d-flex justify-content-between">
                    <p>{prodname}</p>
                    <p style={{fontWeight:"bold"}}>GHS {prodamount}</p>
                </div>
                </div>
                
            </div>
        </>
    );
};

export default ProductScrollNav;