import { Link } from "react-router-dom";

function FooterLanding() {
  const footerLinks = {
    Company: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use", href: "#" },
    ],
    "Agentic AI": [
      { label: "AI Contact Center", href: "#" },
      { label: "AI Sales", href: "#" },
      { label: "AI Communication", href: "#" },
    ],
    "Solutions by Industries": [
      { label: "Insurance", href: "#" },
      { label: "Education", href: "#" },
      { label: "Healthcare", href: "#" },
      { label: "Real Estate", href: "#" },
      { label: "Recruiting", href: "#" },
      { label: "Technology", href: "#" },
      { label: "Professional Services", href: "#" },
      { label: "Retail", href: "#" },
      { label: "Automotive", href: "#" },
    ],
    Resources: [
      { label: "Partnership", href: "#" },
      { label: "Comparison", href: "#" },
      { label: "Enterprise Solution", href: "#" },
    ],
    "Contact Us": [{ label: "support@paulcall.ai", href: "#" }],
  };

  const socialLinks = [
    { href: "#", icon: "lucide-facebook" },
    { href: "#", icon: "lucide-linkedin" },
    { href: "#", icon: "lucide-twitter" },
    { href: "#", icon: "lucide-instagram" },
  ];

  return (
    <>
      <footer className="text-gray-700 py-10 mt-10 w-full bg-gradient-to-b from-[#13243C] to-[#00021D]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex justify-center md:justify-start mb-8">
            <Link to="/" className="text-2xl text-white font-bold">
              Paul.<span className="font-semibold text-white">Calling</span>
            </Link>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-center md:text-left">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h3 className="font-semibold mb-4 text-white">{section}</h3>

                {section !== "Contact Us" ? (
                  <ul className="space-y-2">
                    {links.map(({ label, href }) => (
                      <li key={label}>
                        <a
                          href={href}
                          className="text-xs text-white hover:text-blue-500 transition-colors"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center md:items-start space-y-3">
                    <a
                      href={links[0].href}
                      className="text-sm text-white hover:text-blue-500 transition-colors"
                    >
                      {links[0].label}
                    </a>
                    {/* Social Icons */}
                    <div className="flex justify-center md:justify-start space-x-4 mt-2">
                      {socialLinks.map(({ href, icon }) => (
                        <a
                          key={href}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white transition-colors"
                        >
                          <i className={`lucide ${icon}`} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-200 mt-10 pt-6">
            <p className="text-center text-sm text-white">
              ©{new Date().getFullYear()} | All rights reserved by Paul.ai AI
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default FooterLanding;
