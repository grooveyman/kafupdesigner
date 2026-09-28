import { NavLink } from "react-router-dom";
import { LayoutGrid, FolderOpen, Store, UserRound } from "lucide-react";

interface ProfileNavProps {
    brandName?: string;
}

const links = [
    { to: "/profile", label: "Overview", icon: UserRound },
    { to: "/categories", label: "Categories", icon: LayoutGrid },
    { to: "/collections", label: "Collections", icon: FolderOpen },
    { to: "/profile-shop", label: "Shop", icon: Store },
];

const ProfileNav: React.FC<ProfileNavProps> = ({ brandName }) => {
    return (
        <>
            {/* Desktop bar */}
            <header className="kf-nav hidden md:block">
                <nav className="kf-nav__inner">
                    <span className="kf-nav__brand">{brandName || "My Profile"}</span>
                    <ul className="kf-nav__links">
                        {links.map(({ to, label }) => (
                            <li key={to}>
                                <NavLink to={to} end className="kf-nav__link">
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            {/* Mobile bottom nav */}
            <nav className="kf-bottomnav md:hidden">
                <ul>
                    {links.map(({ to, label, icon: Icon }) => (
                        <li key={to}>
                            <NavLink to={to} end className="kf-bottomnav__link">
                                <Icon size={20} />
                                <span>{label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
};

export default ProfileNav;
