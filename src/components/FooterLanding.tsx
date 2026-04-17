import { Link } from "react-router-dom";
import { Facebook, Linkedin, Twitter, Instagram, Mail } from "lucide-react";

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
    "Solutions": [
      { label: "Insurance", href: "#" },
      { label: "Education", href: "#" },
      { label: "Healthcare", href: "#" },
      { label: "Real Estate", href: "#" },
      { label: "Automotive", href: "#" },
    ],
    Resources: [
      { label: "Partnership", href: "#" },
      { label: "Comparison", href: "#" },
      { label: "Enterprise", href: "#" },
    ],
  };

  const socialLinks = [
    { href: "#", icon: <Facebook size={18} /> },
    { href: "#", icon: <Linkedin size={18} /> },
    { href: "#", icon: <Twitter size={18} /> },
    { href: "#", icon: <Instagram size={18} /> },
  ];

  return (
    <footer className="relative pt-24 pb-12 mt-20 border-t border-white/5 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-brand-primary/10 blur-[120px] rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link to="/" className="text-3xl font-black tracking-tighter text-white">
              Paul<span className="text-brand-primary">.ai</span>
            </Link>
            <p className="mt-6 text-gray-400 font-medium leading-relaxed max-w-xs">
              Next-generation AI calling agents that transform how businesses communicate. Real. Fast. Intelligent.
            </p>
            <div className="flex space-x-4 mt-8">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-brand-primary hover:bg-white/10 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="col-span-1">
              <h3 className="text-white font-bold tracking-tight mb-6 uppercase text-xs opacity-50">{section}</h3>
              <ul className="space-y-4">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className="col-span-1">
            <h3 className="text-white font-bold tracking-tight mb-6 uppercase text-xs opacity-50">Contact</h3>
            <a
              href="mailto:support@paulcall.ai"
              className="group flex items-center gap-2 text-gray-400 hover:text-brand-primary transition-colors text-sm font-medium"
            >
              <Mail size={16} className="group-hover:scale-110 transition-transform" />
              support@paulcall.ai
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-medium tracking-wide">
            © {new Date().getFullYear()} Paul AI Dynamics. Built for the future of calling.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterLanding;
