import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  PhoneCall,
  // FileUp,
  FileText,
  Mic,
  Calendar,
  LogOut,
  Target,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

interface SidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, setIsCollapsed }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Initiate Call", path: "/call", icon: <PhoneCall size={20} /> },
    { label: "Campaigns", path: "/campaigns", icon: <Target size={20} /> },
    { label: "Appointments", path: "/appointments", icon: <Calendar size={20} /> },
    // { label: "Upload CSV", path: "/upload-csv", icon: <FileUp size={20} /> },
    { label: "Agents Voice", path: "/voice", icon: <Mic size={20} /> },
    { label: "Prompts", path: "/settings", icon: <FileText size={20} /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex h-full relative">
      {/* ✅ Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-60 p-2 glass rounded-xl text-brand-primary active:scale-95 transition-all"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Container */}
      <div
        className={`${mobileOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:static top-0 left-0 h-screen glass bg-[#0b1123]! border-r border-white/5 transform lg:translate-x-0 transition-all duration-500 ease-in-out z-50 flex flex-col ${isCollapsed ? "w-20" : "w-64"
          }`}
      >
        {/* Toggle Button for Desktop */}
        <button
          onClick={() => setIsCollapsed?.(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-12 w-6 h-6 bg-brand-primary text-white rounded-full items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-60 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo Section */}
        <div className={`flex items-center justify-between p-8 ${isCollapsed ? "px-4" : "p-8"}`}>
          <Link to="/" className={`text-2xl font-black tracking-tighter text-white transition-all overflow-hidden ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
            Paul<span className="text-brand-primary">.ai</span>
          </Link>
          {isCollapsed && (
            <Link to="/" className="text-xl font-black text-brand-primary mx-auto">P.</Link>
          )}
          <button
            className="lg:hidden p-2 text-white/50 hover:text-brand-accent transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className={`flex-1 px-4 space-y-2 py-4 overflow-hidden ${isCollapsed ? "px-2" : "px-4"}`}>
          <p className={`px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 transition-all ${isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
            Main Menu
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : ""}
                className={`flex items-center gap-3 rounded-2xl transition-all duration-300 relative group ${isCollapsed ? "px-3 py-3 justify-center" : "px-4 py-3.5"
                  } ${isActive
                    ? "bg-brand-primary/10 text-white font-bold shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                onClick={() => setMobileOpen(false)}
              >
                <div className={`${isActive ? "text-brand-primary" : "text-gray-500 group-hover:text-brand-primary"} transition-colors duration-300 shrink-0`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="text-sm tracking-tight truncate">{item.label}</span>}
                {isActive && (
                  <div className={`absolute left-0 bg-brand-primary rounded-r-full shadow-[0_0_10px_rgba(14,165,233,0.5)] ${isCollapsed ? "w-1 h-8" : "w-1.5 h-6"}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : ""}
            className={`w-full flex items-center gap-3 rounded-2xl text-gray-400 hover:text-brand-accent hover:bg-brand-accent/10 transition-all duration-300 font-bold text-sm tracking-tight cursor-pointer ${isCollapsed ? "px-0 justify-center py-4" : "px-4 py-4"
              }`}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40 transition-opacity duration-500"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
