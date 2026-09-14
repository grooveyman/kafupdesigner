import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Person from "./Person";
import "./profile.css";
import PersonNav from "./ProfileNav";
import { Pencil } from "lucide-react";
import Content from "./Content";


const Profile: React.FC = () => {
    const { username } = useParams();
    console.log("username: " + username);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [slides, setSlides] = useState<{ src: string; alt: string }[]>([]);

    const handleImageClick = (imageSrc: string, imageIndex: number) => {
        setSlides([{ src: imageSrc, alt: `Design ${imageIndex}` }]);
        setIndex(imageIndex);
        setOpen(true);
    };

    const portfolioImages = [
        {
            src: "https://res.cloudinary.com/dm104hogb/image/upload/v1757794303/kreationz/products/kbbgdq9ffyufsoedz8as.jpg",
            alt: "Design 1"
        },
        {
            src: "https://res.cloudinary.com/dm104hogb/image/upload/v1757794303/kreationz/products/kbbgdq9ffyufsoedz8as.jpg",
            alt: "Design 2"
        },
        {
            src: "https://res.cloudinary.com/dm104hogb/image/upload/v1757794303/kreationz/products/kbbgdq9ffyufsoedz8as.jpg",
            alt: "Design 3"
        }
    ];

    return (
        <>
            <div className="pb-20">
                <PersonNav />
                <div className="container">
                    <div className="mt-4">
                        {/* profile banner */}
                        <div className="profile-banner">
                            <img className="w-full h-[50vh] object-cover rounded-xl" src="https://res.cloudinary.com/dm104hogb/image/upload/v1757794303/kreationz/products/kbbgdq9ffyufsoedz8as.jpg" />
                            <button className="banner-action btn btn-sm btn-primary absolute bottom-10 left-10">View Product</button>
                             <button className="banner-action-edit btn btn-sm btn-primary absolute top-4 right-4"><Pencil size={15}/></button>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-md-3 profile-person">
                            <Person />
                        </div>
                        <div className="col-md-9 profile-content">
                            <Content />
                            
                            
                        </div>
                    </div>
                </div>

                {/* <Lightbox
                    open={open}
                    close={() => setOpen(false)}
                    index={index}
                    slides={slides}
                /> */}
            </div>
        </>
    );
}

export default Profile;