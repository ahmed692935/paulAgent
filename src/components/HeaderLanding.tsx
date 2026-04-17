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
          isScrolled ? "glass !bg-dark-bg/60 shadow-2xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto w-full h-full flex items-center justify-between">
          {/* Logo */}
          <h3
            className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-200 ${
              isScrolled ? "text-brand-primary" : "text-white"
            }`}
          >
            Paul<span className="text-brand-secondary">.ai</span>
          </h3>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <li
                key={item.key}
                onClick={() => handleScrollTo(item.id)}
                className={`list-none cursor-pointer font-medium transition-all duration-200 text-sm tracking-wide uppercase ${
                  isScrolled
                    ? "text-gray-300 hover:text-brand-primary"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </li>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            {/* IF USER IS LOGGED IN */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-all"
                >
                  <span className={`font-medium ${isScrolled ? "text-gray-200" : "text-white"}`}>
                    {user.email.slice(0, 5)}...
                  </span>
                  <FaRegUserCircle className="text-brand-primary" size={20} />
                  <FaChevronDown className="text-white/50" size={10} />
                </button>

                {/* DROPDOWN */}
                {openDropdown && (
                  <div className="absolute right-0 mt-3 w-48 glass rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-glass-border glass-blur">
                      <p className="text-xs text-white/50 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      className="block px-4 py-3 hover:bg-white/10 text-sm text-gray-200 transition-colors"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={() => dispatch(logout())}
                      className="w-full text-left px-4 py-3 hover:bg-brand-accent/20 text-sm text-brand-accent transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-6 py-2 text-sm font-semibold text-white hover:text-brand-primary transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 text-sm font-semibold rounded-full bg-brand-primary text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-brand-primary/40 hover:scale-105 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`md:hidden p-2 rounded-lg glass focus:outline-none transition-colors duration-300 cursor-pointer ${
              isScrolled ? "text-brand-primary" : "text-white"
            }`}
          >
            <Menu />
          </button>
        </div>

        {/* Mobile Slide Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-3/4 sm:w-2/3 glass !bg-dark-bg/95 shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 left-5 p-2 text-white/50 hover:text-brand-accent transition-all cursor-pointer"
          >
            <X />
          </button>

          <div className="flex flex-col items-center mt-24 space-y-8 px-6">
            {/* Nav Links */}
            <ul className="flex flex-col items-center space-y-4 w-full">
              {menuItems.map((item) => (
                <li
                  key={item.key}
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-3 cursor-pointer text-gray-300 font-semibold text-lg hover:text-brand-primary border-b border-white/5 transition-colors duration-200"
                >
                  {item.label}
                </li>
              ))}
            </ul>

            {/* Auth Buttons */}
            <div className="flex flex-col space-y-4 w-full pt-8">
              {user ? (
                <div className="relative w-full">
                  <button
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="flex items-center justify-between w-full px-5 py-3 rounded-xl glass text-white font-semibold"
                  >
                    <span>{user.email.slice(0, 8)}...</span>
                    <FaChevronDown className="text-brand-primary" />
                  </button>

                  {openDropdown && (
                    <div className="mt-2 glass rounded-xl overflow-hidden flex flex-col">
                      <div className="px-4 py-3 border-b border-white/5 text-white/50 text-xs">
                        {user.email}
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-3 hover:bg-white/5 text-gray-300 transition-colors"
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          dispatch(logout());
                          setMenuOpen(false);
                        }}
                        className="px-4 py-3 hover:bg-brand-accent/10 text-brand-accent text-left w-full transition-colors"
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
                    className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] text-center transition-all"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="w-full glass text-white py-4 rounded-xl font-bold hover:bg-white/5 text-center transition-all"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-500"
          ></div>
        )}
      </header>
    </>
  );
}

export default HeaderLanding;
