import { ChevronDown, User, Menu, X } from "lucide-react";
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
  const productsMenuRef = useRef<HTMLLIElement>(null);
  const [open, setOpen] = useState(false); // profile dropdown
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false); // mobile menu

  // ✅ Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Close mobile menu when route changes
  useEffect(() => {
    setOpenMenu(false);
    setMobileProductsOpen(false);
    setProductsOpen(false);
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
            <NavLink
              to="/"
              className="no-underline text-sm text-gray-300 hover:text-white"
              style={{ textDecoration: "none", color: "white" }}
            >
              Dashboard
            </NavLink>
            <li className="relative" ref={productsMenuRef}>
              <button
                type="button"
                onClick={() => setProductsOpen(!productsOpen)}
                className="flex items-center gap-1 text-sm text-white"
                aria-expanded={productsOpen}
                aria-haspopup="menu"
              >
                Products
                <ChevronDown className={`h-4 w-4 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
              </button>

              {productsOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg z-[9999]" role="menu">
                  <NavLink
                    to="/products"
                    className="block px-4 py-2 text-sm text-gray-700 no-underline hover:bg-gray-100"
                    role="menuitem"
                  >
                    All products
                  </NavLink>
                  <NavLink
                    to="/addproducts"
                    className="block px-4 py-2 text-sm text-gray-700 no-underline hover:bg-gray-100"
                    role="menuitem"
                  >
                    Add product
                  </NavLink>
                </div>
              )}
            </li>

             <NavLink
              to="/"
              className="no-underline text-sm text-gray-300 hover:text-white"
              style={{ textDecoration: "none", color: "white" }}
            >
              Orders
            </NavLink>

             <NavLink
              to="/"
              className="no-underline text-sm text-gray-300 hover:text-white"
              style={{ textDecoration: "none", color: "white" }}
            >
              Reports
            </NavLink>

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
            {items.map((item) => item.label === "Products" ? (
              <div key={item.to} className="border-b px-4 py-2">
                <button
                  type="button"
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  className="flex w-full items-center justify-between py-2 text-left text-gray-700"
                  aria-expanded={mobileProductsOpen}
                >
                  Products
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileProductsOpen && (
                  <div className="pb-1 pl-3">
                    <NavLink
                      to="/products"
                      onClick={() => setOpenMenu(false)}
                      className="block py-2 text-sm text-gray-600 no-underline hover:text-black"
                    >
                      All products
                    </NavLink>
                    <NavLink
                      to="/addproducts"
                      onClick={() => setOpenMenu(false)}
                      className="block py-2 text-sm text-gray-600 no-underline hover:text-black"
                    >
                      Add product
                    </NavLink>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpenMenu(false)}
                className="block px-4 py-2 no-underline text-gray-700 hover:text-black focus:outline-none"
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