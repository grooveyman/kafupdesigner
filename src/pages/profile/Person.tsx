import { Facebook, Instagram, Twitter, Youtube, MapPin, BadgeCheck } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import type { DesignerType } from "../../types/types";

export interface ProfileStats {
    designs: number;
    collections: number;
    categories: number;
    listed: number;
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
    const socials = [
        { href: designer?.social_fb, Icon: Facebook, label: "Facebook" },
        { href: designer?.social_ig, Icon: Instagram, label: "Instagram" },
        { href: designer?.social_tw, Icon: Twitter, label: "Twitter" },
        { href: designer?.social_yt, Icon: Youtube, label: "YouTube" },
        { href: designer?.social_tk, Icon: FaTiktok, label: "TikTok" },
    ].filter((s) => !!s.href);

    const statItems = [
        { value: stats.designs, label: "Designs" },
        { value: stats.collections, label: "Collections" },
        { value: stats.categories, label: "Categories" },
        { value: stats.listed, label: "Listed" },
    ];

    if (loading) {
        return (
            <div className="kf-card">
                <div className="kf-person__top">
                    <div className="kf-skeleton" style={{ width: 88, height: 88, borderRadius: 16 }} />
                    <div style={{ flex: 1 }}>
                        <div className="kf-skeleton" style={{ height: 20, width: "70%" }} />
                        <div className="kf-skeleton" style={{ height: 12, width: "45%", marginTop: 10 }} />
                    </div>
                </div>
                <div className="kf-stats">
                    {statItems.map((_, i) => (
                        <div key={i} className="kf-skeleton" style={{ height: 62 }} />
                    ))}
                </div>
                <div className="kf-skeleton" style={{ height: 60, marginTop: 22 }} />
            </div>
        );
    }

    return (
        <div className="kf-card">
            <div className="kf-person__top">
                {designer?.brand_profile_img ? (
                    <img className="kf-avatar" src={designer.brand_profile_img} alt={designer.brand_name} />
                ) : (
                    <div className="kf-avatar kf-avatar--fallback">{getInitials(designer?.brand_name)}</div>
                )}
                <div>
                    <h4 className="kf-person__name">{designer?.brand_name || "Unnamed brand"}</h4>
                    <p className="kf-person__role">
                        <BadgeCheck size={15} color="#f5c400" /> Verified designer
                    </p>
                </div>
            </div>

            <div className="kf-stats">
                {statItems.map((s) => (
                    <div key={s.label} className="kf-stat">
                        <div className="kf-stat__value">{s.value}</div>
                        <span className="kf-stat__label">{s.label}</span>
                    </div>
                ))}
            </div>

            {designer?.pitch && <p className="kf-person__bio">{designer.pitch}</p>}

            {socials.length > 0 && (
                <>
                    <hr className="kf-divider" />
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
                    <hr className="kf-divider" />
                    <p className="kf-section-title">Location</p>
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
