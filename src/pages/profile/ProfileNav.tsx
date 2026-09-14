import { NavLink } from "react-router-dom";
import { FaHome, FaThLarge, FaShoppingBag } from "react-icons/fa";

const ProfileNav = () => {
    return (
        <>
            {/* Desktop Navbar */}
            <header className="profilenav hidden md:block border-b bg-dark">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex h-14 items-center justify-between">

                        <div>
                            <span className="text-lg font-semibold text-gray-400">
                                Katy Simpsons
                            </span>
                        </div>

                        <ul className="flex space-x-6 items-center m-0 p-0 list-none">
                            <li>
                                <NavLink to="/profile-category" className="text-gray-400 hover:text-white" style={{textDecoration:"none", color:"gray"}}>
                                    Categories
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/profile-collections" className="text-gray-400 hover:text-white" style={{textDecoration:"none", color:"gray"}}>
                                    Collections
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/profile-shop" className="text-gray-400 hover:text-white" style={{textDecoration:"none", color:"gray"}}>
                                    Shop
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md md:hidden z-[9999]">
                <ul className="flex justify-around items-center py-2">

                    <li>
                        <NavLink
                            to="/"
                            className="flex flex-col items-center text-xs text-gray-600"
                        >
                            <FaThLarge className="text-lg" />
                            <span>Categories</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/"
                            className="flex flex-col items-center text-xs text-gray-600"
                        >
                            <FaHome className="text-lg" />
                            <span>Collections</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/"
                            className="flex flex-col items-center text-xs text-gray-600"
                        >
                            <FaShoppingBag className="text-lg" />
                            <span>Shop</span>
                        </NavLink>
                    </li>

                </ul>
            </nav>
        </>
    );
};

export default ProfileNav;