import { User, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavItem {
  label: string;
  to: string;
}

interface NavbarProps {
  items: NavItem[];
}

const MainNavBar: React.FC<NavbarProps> = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuRef = useRef<HTMLLIElement>(null);
  const [open, setOpen] = useState(false); // profile dropdown
  const [openMenu, setOpenMenu] = useState(false); // mobile menu

  // ✅ Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Close mobile menu when route changes
  useEffect(() => {
    setOpenMenu(false);
  }, [location.pathname]);

  return (
    <header className="border-b bg-dark relative">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Top Bar */}
        <div className="flex h-14 items-center justify-between">

          {/* Logo */}
          <span className="text-lg font-semibold text-white">
            Kafup Designer
          </span>

          {/* ✅ Desktop Menu */}
          <ul className="hidden md:flex space-x-6 items-center m-0 p-0 list-none">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className="no-underline text-sm text-gray-300 hover:text-white"
                  style={{textDecoration:"none", color:"white"}}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}

            {/* Profile Dropdown */}
            <li className="relative" ref={menuRef}>
              <button onClick={() => setOpen(!open)}>
                <User className="w-5 h-5 text-white cursor-pointer" />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-[9999]">
                  <button
                    onClick={() => { setOpen(false); navigate("/profile"); }}
                    className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { setOpen(false); navigate("/settings"); }}
                    className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => { setOpen(false); handleLogout(); }}
                    className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>

          {/* ✅ Mobile Hamburger */}
          <button
            className="md:hidden text-white transition-transform duration-300"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <div className={`${openMenu ? "rotate-90" : ""} transition-transform`}>
              {openMenu ? <X /> : <Menu />}
            </div>
          </button>
        </div>

        {/* ✅ Mobile Dropdown Menu */}
        {openMenu && (
          <div
            onClick={() => setOpenMenu(false)}
            className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
          />
        )}
        <div className="relative">
          <div
            className={`md:hidden absolute left-0 w-full mt-2 bg-white rounded-lg shadow-md py-3 
            transform transition-all duration-300 ease-out z-[9999]
            ${openMenu
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-3 scale-95 pointer-events-none"
              }`}
          >
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpenMenu(false)}
                className="no-underline text-gray-700 hover:text-black focus:outline-none"
              >
                {item.label}
              </NavLink>
            ))}

            <div className="border-t mt-2 pt-2">
              <button
                onClick={() => { navigate("/profile"); setOpenMenu(false); }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </button>

              <button
                onClick={() => { navigate("/settings"); setOpenMenu(false); }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Settings
              </button>

              <button
                onClick={() => { handleLogout(); setOpenMenu(false); }}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

      </nav>
    </header>
  );
};

export default MainNavBar;