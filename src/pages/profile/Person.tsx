import { useState } from "react";
import { MapPin, Heart, Share2, Star } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube, FaTiktok } from "react-icons/fa6";
import { toast } from "react-toastify";
import type { DesignerType } from "../../types/types";

export interface ProfileStats {
    designs: number;
    collections: number;
    sold: number;
    followers: number;
}

interface PersonProps {
    designer?: DesignerType;
    stats: ProfileStats;
    loading?: boolean;
}

const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");
};

const Person: React.FC<PersonProps> = ({ designer, stats, loading }) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    const socials = [
        { href: designer?.social_fb, Icon: FaFacebookF, label: "Facebook" },
        { href: designer?.social_ig, Icon: FaInstagram, label: "Instagram" },
        { href: designer?.social_tw, Icon: FaXTwitter, label: "Twitter" },
        { href: designer?.social_yt, Icon: FaYoutube, label: "YouTube" },
        { href: designer?.social_tk, Icon: FaTiktok, label: "TikTok" },
    ].filter((s) => !!s.href);

    const statItems = [
        { value: stats.designs, label: "Designs" },
        { value: stats.collections, label: "Collections" },
        { value: stats.sold, label: "Sold" },
        { value: stats.followers, label: "Followers" },
    ];

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: designer?.brand_name || "Designer profile", url });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success("Profile link copied");
            }
        } catch {
            /* share dismissed */
        }
    };

    if (loading) {
        return (
            <div className="kf-card kf-person">
                <div className="kf-skeleton kf-person__photo" />
                <div className="kf-skeleton" style={{ height: 24, width: "60%", marginTop: 18 }} />
                <div className="kf-skeleton" style={{ height: 14, width: "85%", marginTop: 14 }} />
                <div className="kf-skeleton" style={{ height: 70, marginTop: 16 }} />
            </div>
        );
    }

    return (
        <div className="kf-card kf-person">
            <div className="kf-person__photo">
                {designer?.brand_profile_img ? (
                    <img className="kf-person__img" src={designer.brand_profile_img} alt={designer.brand_name} />
                ) : (
                    <div className="kf-person__img kf-person__img--fallback">{getInitials(designer?.brand_name)}</div>
                )}
            </div>

            <h3 className="kf-person__name">{designer?.brand_name || "Unnamed brand"}</h3>

            <div className="kf-person__stats">
                {statItems.map((s) => (
                    <span key={s.label} className="kf-pstat">
                        <b className="kf-pstat__value">{s.value}</b> {s.label}
                    </span>
                ))}
            </div>

            {designer?.pitch && <p className="kf-person__bio">{designer.pitch}</p>}

            <div className="kf-actions">
                <button
                    type="button"
                    className={`kf-action${liked ? " is-active" : ""}`}
                    onClick={() => setLiked((v) => !v)}
                    aria-pressed={liked}
                    aria-label="Like"
                >
                    <Heart size={18} fill={liked ? "currentColor" : "none"} />
                </button>
                <button type="button" className="kf-action" onClick={handleShare} aria-label="Share profile">
                    <Share2 size={18} />
                </button>
                <button
                    type="button"
                    className={`kf-action${saved ? " is-active" : ""}`}
                    onClick={() => setSaved((v) => !v)}
                    aria-pressed={saved}
                    aria-label="Save"
                >
                    <Star size={18} fill={saved ? "currentColor" : "none"} />
                </button>
            </div>

            {socials.length > 0 && (
                <>
                    <p className="kf-section-title">Socials</p>
                    <div className="kf-socials">
                        {socials.map(({ href, Icon, label }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="kf-social"
                                aria-label={label}
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </>
            )}

            {designer?.address && (
                <>
                    <p className="kf-section-title">Locations</p>
                    <div className="kf-location">
                        <MapPin size={16} color="#f5c400" />
                        <span>{designer.address}</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default Person;
