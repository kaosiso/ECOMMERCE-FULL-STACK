import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);
  const location = useLocation();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/collection", label: "Collection" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <div
      className={`flex items-center justify-between py-5 font-medium transition-all duration-700 px-5 sm:px-10 ${
        animate ? "animate-fadeSlideDown" : "opacity-0"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <h1 className="logo text-gray-800 hover:text-black transition-transform duration-300 hover:scale-105">
          Everest
        </h1>
      </Link>

      {/* Desktop Nav Links */}
      <ul className="hidden sm:flex gap-6 text-sm text-gray-700">
        {navLinks.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 group px-2 py-1 rounded-md transition-colors duration-200 ${
                isActive ? "text-black" : ""
              }`
            }
          >
            <p>{label}</p>
            <hr
              className={`w-2/4 h-[1.5px] border-none bg-gray-700 origin-left transition-transform duration-300 
                ${
                  location.pathname === path ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100`}
            />
          </NavLink>
        ))}
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer hover:scale-110 transition-transform"
          alt="Search"
        />
        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            className="w-5 cursor-pointer text-gray-100 hover:scale-110 transition-transform"
            src={assets.profile_icon}
            alt="Profile"
          />
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 animate-fadeSlideDown z-50">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-sm">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-gray-800 text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Toggle */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-white shadow-md transition-all duration-500 ease-in-out z-50 ${
          visible ? "w-4/5 px-6 py-5" : "w-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 mb-6 cursor-pointer"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="Back"
            />
            <p>Back</p>
          </div>
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setVisible(false)}
              className="py-2 pl-2 border-b"
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
