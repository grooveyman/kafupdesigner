import { useRef } from "react";
import { FacebookIcon, InstagramIcon, Pencil, PencilLineIcon, TwitterIcon, YoutubeIcon } from "lucide-react";


const Person: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file);
            // Handle file upload here
        }
    };

    return (
        <>
            <div className="row">
                <div className="profile-dp">
                    <img className="w-full h-[35vh] object-cover rounded" src="https://res.cloudinary.com/dm104hogb/image/upload/v1757794303/kreationz/products/kbbgdq9ffyufsoedz8as.jpg" />
                    <span className="profile-edit-btn" onClick={handleEditClick} style={{ cursor: 'pointer' }}><Pencil size={15} /></span>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>
            <div className="row mt-3">
                <div className="head">
                    <h4 className="head-name">Katy Simpson</h4>
                </div>
                <div className="meta row">
                    <button className="col-md-3 btn btn-sm btn-secondary">23 Designs</button>
                    <button className="col-md-3 btn btn-sm btn-secondary">9 Collections</button>
                    <button className="col-md-3 btn btn-sm btn-secondary">7 Sold</button>
                    <button className="col-md-3 btn btn-sm btn-secondary">5 Followers</button>
                </div>
            </div>
            <div className="row mt-5">
                <div className="desc text-white">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste exercitationem commodi dolores voluptatem, est iure itaque optio dolorum reiciendis nam quisquam reprehenderit consequatur cumque perferendis.
                </div>

            </div>
            <div className="row mt-4">
                <div className="socials text-white">
                    <h6 className="mb-3">Socials</h6>
                    <div className="social-icons flex space-x-2">
                        <span className="p-2 bg-black"><FacebookIcon size={20} /></span>
                        <span className="p-2 bg-black"><InstagramIcon size={20} /></span>
                        <span className="p-2 bg-black"><TwitterIcon size={20} /></span>
                        <span className="p-2 bg-black"><YoutubeIcon size={20} /></span>
                    </div>

                </div>
                
            </div>
            <div className="row mt-4 mb-4">
                <div className="locations text-white">
                    <h6 className="mb-2">Locations</h6>
                    <span>Ashaiman, Accra</span>
                </div>
            </div>

            <div className="row">

            </div>
        </>
    );
};

export default Person;