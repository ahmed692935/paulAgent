import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { FaChevronDown, FaRegUserCircle } from "react-icons/fa";
import type { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

function HeaderLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const menuItems = [
    { key: "home", label: "Home", id: "home" },
    { key: "about", label: "About", id: "about" },
    { key: "services", label: "Services", id: "services" },
    { key: "contact", label: "Contact", id: "contact" },
  ];

  // Logged In user
  const dispatch = useDispatch();
  // const { user } = useSelector((state: RootState) => state.auth);

  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full h-16 sm:h-20 z-50 transition-all duration-300 px-4 md:px-8 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto w-full h-full flex items-center justify-between">
          {/* Logo */}
          <h3
            className={`text-xl sm:text-2xl font-bold transition-colors duration-200 ${
              isScrolled ? "text-[#13243C]" : "text-white"
            }`}
          >
            Caller Dialing
          </h3>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <li
                key={item.key}
                onClick={() => handleScrollTo(item.id)}
                className={`list-none cursor-pointer font-semibold transition-colors duration-200 text-base ${
                  isScrolled
                    ? "text-[#13243C] hover:text-blue-700"
                    : "text-white hover:text-[#13243C]"
                }`}
              >
                {item.label}
              </li>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex space-x-3">
            {/* IF USER IS LOGGED IN */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer"
                >
                  {/* 5 Characters + ... */}
                  {/* <span className="font-semibold text-[#fff]">
                    {user.email.slice(0, 5)}...
                  </span> */}
                  <span
                    className={`font-semibold ${
                      isScrolled ? "text-[#13243C]" : "text-white"
                    }`}
                  >
                    {user.email.slice(0, 5)}...
                  </span>

                  {/* <FaRegUserCircle className="text-white" size={24} /> */}
                  <FaRegUserCircle
                    className={`${
                      isScrolled ? "text-[#13243C]" : "text-white"
                    }`}
                    size={24}
                  />
                  <FaChevronDown className="text-white" size={12} />
                </button>

                {/* DROPDOWN */}
                {openDropdown && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                    {/* FULL EMAIL SHOW */}
                    {/* <div className="px-4 py-2 border-b border-gray-200 text-[#3d4b52]/70">
                      {user.email}
                    </div> */}
                    <div
                      className={`font-semibold ${
                        isScrolled ? "text-[#13243C]" : "text-white"
                      }`}
                    >
                      {user.email}
                    </div>

                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 text-[#3d4b52]"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={() => dispatch(logout())}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#3d4b52] cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* IF USER IS NOT LOGGED IN → SHOW SIGNUP + LOGIN */}

                <Link
                  to="/signup"
                  className={`h-9 sm:h-10 px-3 sm:px-5 text-sm sm:text-base rounded-md font-semibold flex items-center justify-center transition-all duration-300
      ${
        isScrolled
          ? "bg-white text-[#13243C] border border-[#13243C] hover:bg-[#13243C] hover:text-white"
          : "bg-white text-[#13243C] hover:bg-[#13243C] hover:text-white"
      }`}
                >
                  Sign Up
                </Link>

                <Link
                  to="/signin"
                  className={`h-9 sm:h-10 px-3 sm:px-5 text-sm sm:text-base rounded-md font-semibold flex items-center justify-center transition-all duration-300
      ${
        isScrolled
          ? "bg-white text-[#13243C] border border-[#13243C] hover:bg-[#13243C] hover:text-white"
          : "bg-white text-[#13243C] hover:bg-[#13243C] hover:text-white"
      }`}
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`md:hidden text-3xl focus:outline-none transition-colors duration-300 cursor-pointer ${
              isScrolled ? "text-[#13243C]" : "text-white"
            }`}
          >
            <Menu />
          </button>
        </div>

        {/* Mobile Slide Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-3/4 sm:w-2/3 bg-white shadow-lg z-50 transform transition-transform duration-500 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 left-5 text-3xl text-[#13243C] hover:text-blue-700 transition-all cursor-pointer"
          >
            <X />
          </button>

          <div className="flex flex-col items-center mt-20 space-y-6">
            {/* Nav Links */}
            <ul className="flex flex-col items-center space-y-3">
              {menuItems.map((item) => (
                <li
                  key={item.key}
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer text-[#13243C] font-semibold text-lg hover:text-blue-700 transition-colors duration-200"
                >
                  {item.label}
                </li>
              ))}
            </ul>

            {/* Auth Buttons */}
            <div className="flex flex-col space-y-3 w-[80%] mt-10">
              {user ? (
                <div className="relative w-full">
                  <button
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="flex items-center justify-between w-full px-4 py-2 rounded-md border border-[#13243C] bg-[#13243C] text-white font-semibold"
                  >
                    <span>{user.email.slice(0, 5)}...</span>
                    <FaChevronDown />
                  </button>

                  {openDropdown && (
                    <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 flex flex-col">
                      <div className="px-4 py-2 border-b text-gray-700">
                        {user.email}
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          dispatch(logout());
                          setMenuOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-left w-full"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="bg-[#13243C] text-white py-2 rounded-md font-semibold hover:bg-blue-800 text-center transition-all"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="bg-white border border-[#13243C] text-[#13243C] py-2 rounded-md font-semibold hover:bg-blue-900 hover:text-white text-center transition-all"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500"
          ></div>
        )}
      </header>
    </>
  );
}

export default HeaderLanding;
