import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

function HeaderLanding() {

    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = ["Home", "About", "Services", "Contact"];

    return (
        <>
            {/* Header */}
            < header
                className={`fixed top-0 left-0 w-full h-16 sm:h-20 z-50 transition-all duration-300 px-4 md:px-8 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"
                    }`
                }
            >
                <div className="max-w-6xl mx-auto w-full h-full flex items-center justify-between">
                    {/* Logo */}
                    <h3
                        className={`text-xl sm:text-2xl font-bold transition-colors duration-200 ${isScrolled ? "text-blue-900" : "text-white"
                            }`}
                    >
                        Paul
                    </h3>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {menuItems.map((item, index) => (
                            <li
                                key={index}
                                className={`list-none cursor-pointer font-semibold transition-colors duration-200 text-base ${isScrolled
                                    ? "text-blue-900 hover:text-blue-700"
                                    : "text-white hover:text-blue-900"
                                    }`}
                            >
                                {item}
                            </li>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex space-x-3">
                        <a
                            href="#"
                            className={`h-9 sm:h-10 px-3 sm:px-5 text-sm sm:text-base rounded-md font-semibold flex items-center justify-center transition-all duration-300
      ${isScrolled
                                    ? "bg-white text-blue-900 border border-blue-900 hover:bg-blue-900 hover:text-white"
                                    : "bg-white text-blue-900 hover:bg-blue-900 hover:text-white"
                                }`}
                        >
                            Sign Up
                        </a>

                        <a
                            href="#"
                            className={`h-9 sm:h-10 px-3 sm:px-5 text-sm sm:text-base rounded-md font-semibold flex items-center justify-center transition-all duration-300
      ${isScrolled
                                    ? "bg-white text-blue-900 border border-blue-900 hover:bg-blue-900 hover:text-white"
                                    : "bg-white text-blue-900 hover:bg-blue-900 hover:text-white"
                                }`}
                        >
                            Login
                        </a>
                    </div>


                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className={`md:hidden text-3xl focus:outline-none transition-colors duration-300 cursor-pointer ${isScrolled ? "text-blue-900" : "text-white"
                            }`}
                    >
                        <Menu />
                    </button>
                </div>

                {/* Mobile Slide Menu */}
                <div
                    className={`fixed top-0 right-0 h-full w-3/4 sm:w-2/3 bg-white shadow-lg z-50 transform transition-transform duration-500 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="absolute top-5 left-5 text-3xl text-blue-900 hover:text-blue-700 transition-all cursor-pointer"
                    >
                        <X />
                    </button>

                    <div className="flex flex-col items-center mt-20 space-y-6">
                        {/* Nav Links */}
                        <ul className="flex flex-col items-center space-y-3">
                            {menuItems.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => setMenuOpen(false)}
                                    className="cursor-pointer text-blue-900 font-semibold text-lg hover:text-blue-700 transition-colors duration-200"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Auth Buttons */}
                        <div className="flex flex-col space-y-3 w-[80%] mt-10">
                            <a
                                href="#"
                                onClick={() => setMenuOpen(false)}
                                className="bg-blue-900 text-white py-2 rounded-md font-semibold hover:bg-blue-800 text-center transition-all"
                            >
                                Sign Up
                            </a>
                            <a
                                href="#"
                                onClick={() => setMenuOpen(false)}
                                className="bg-white border border-blue-900 text-blue-900 py-2 rounded-md font-semibold hover:bg-blue-900 hover:text-white text-center transition-all"
                            >
                                Login
                            </a>
                        </div>
                    </div>
                </div>

                {/* Overlay */}
                {
                    menuOpen && (
                        <div
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500"
                        ></div>
                    )
                }
            </header >
        </>
    )
}

export default HeaderLanding
