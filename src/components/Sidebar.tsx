// // src/components/Sidebar.tsx
// import { useState } from "react";
// import { BiMenu, BiX } from "react-icons/bi";
// import { Link, useNavigate } from "react-router-dom";
// import Logo from "../../public/images/sumaLogo.png";
// import { logout } from "../store/slices/authSlice";
// import { useDispatch } from "react-redux";

// const Sidebar = () => {
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const menuItems = [
//     { label: "Dashboard", path: "/dashboard" },
//     { label: "Initiate Call", path: "/call" },
//     // { label: "Logout", path: "/calling" },
//   ];

//   const handleLogout = () => {
//     // clear redux state
//     dispatch(logout());

//     // clear localStorage (if you’re saving auth info there)
//     localStorage.removeItem("user");

//     // redirect
//     navigate("/login");
//   };

//   return (
//     <div className="flex">
//       {/* Mobile Header */}
//       <div className="lg:hidden justify-between w-full p-4">
//         {/* <h1 className="text-xl font-bold">App Name</h1> */}
//         <button onClick={() => setOpen(true)}>
//           <BiMenu size={24} />
//         </button>
//       </div>

//       {/* Sidebar */}
//       <div
//         className={`${
//           open ? "translate-x-0" : "-translate-x-full"
//           // } fixed lg:static top-0 left-0 min-h-[100vh] w-64 bg-gradient-to-b from-[#6d0f78] to-[#0a0f2d] text-white transform lg:translate-x-0 transition-transform duration-300 z-50`}
//         } fixed lg:static top-0 left-0 min-h-[100vh] w-64 bg-white text-white transform lg:translate-x-0 transition-transform duration-300 z-50`}
//       >
//         {/* Sidebar Header with Close Button */}
//         <div className="flex items-center justify-between p-4 border-b border-black">
//           {/* <span className="text-2xl font-bold">Sidebar</span> */}
//           <img src={Logo} width={150} />
//           {/* Close button only on mobile */}
//           <button
//             className="lg:hidden text-black"
//             onClick={() => setOpen(false)}
//           >
//             <BiX size={24} />
//           </button>
//         </div>

//         {/* Nav Links */}
//         <nav className="flex flex-col gap-2 p-4">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className="px-3 py-2 rounded hover:bg-purple-100 text-black"
//               onClick={() => setOpen(false)} // close sidebar on mobile after click
//             >
//               {item.label}
//             </Link>
//           ))}
//           <button
//             onClick={handleLogout}
//             className="px-3 py-2 rounded text-left text-black hover:bg-purple-100"
//           >
//             Logout
//           </button>
//         </nav>
//       </div>

//       {/* Overlay for mobile */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/50 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Sidebar;

// // Ahmed Code
// import { useState } from "react";
// import { BiMenu, BiX } from "react-icons/bi";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// // import Logo from "../../public/images/sumaLogo.png";
// import { logout } from "../store/slices/authSlice";
// import { useDispatch } from "react-redux";

// const Sidebar = () => {
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const menuItems = [
//     { label: "Dashboard", path: "/dashboard" },
//     { label: "Initiate Call", path: "/call" },
//     { label: "Add Prompt", path: "/add-prompt" },
//   ];

//   const handleLogout = () => {
//     dispatch(logout());
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <div className="flex">
//       {/* ✅ Mobile Menu Button */}
//       <button
//         className="lg:hidden fixed top-1 left-1 z-50 p-2 rounded-md"
//         onClick={() => setOpen(true)}
//       >
//         <BiMenu size={24} />
//       </button>
//       <div
//         className={`${open ? "translate-x-0" : "-translate-x-full"
//           } fixed lg:static top-0 left-0 min-h-[100vh] w-64 bg-white text-black transform lg:translate-x-0 transition-transform duration-300 z-50`}
//       >
//         <div className="flex items-center justify-between p-4 border-b border-black">
//           {/* <img src={Logo} width={150} /> */}
//           <p className="text-4xl font-bold text-[#3F3EED] mx-5">Paul</p>
//           <button
//             className="lg:hidden text-black"
//             onClick={() => setOpen(false)}
//           >
//             <BiX size={24} />
//           </button>
//         </div>

//         <nav className="flex flex-col gap-1 pt-4 pl-1 relative">
//           {menuItems.map((item) => {
//             const isActive = location.pathname === item.path;
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`px-3 py-2 rounded relative transition-colors duration-200 pl-5 ${isActive
//                   ? "bg-blue-100 text-[#3F3EED] font-semibold"
//                   : "text-black hover:bg-blue-100"
//                   }`}
//                 onClick={() => setOpen(false)}
//               >
//                 {isActive && (
//                   <div className="absolute left-0 top-0 w-1 h-full bg-[#3F3EED] rounded-r"></div>
//                 )}
//                 {item.label}
//               </Link>
//             );
//           })}
//           <button
//             onClick={handleLogout}
//             className="px-3 py-2 rounded text-left text-black hover:bg-blue-100 pl-5 cursor-pointer"
//           >
//             Logout
//           </button>
//         </nav>
//       </div>

//       {open && (
//         <div
//           className="fixed inset-0 bg-black/50 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Sidebar;

// Abdullah Code
import { useState } from "react";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  PhoneCall, 
  FileUp, 
  FileText, 
  Mic,
  Calendar,
  LogOut,
  Settings,
  Target,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Initiate Call", path: "/call", icon: <PhoneCall size={20} /> },
    { label: "Campaigns", path: "/campaigns", icon: <Target size={20} /> },
    { label: "Appointments", path: "/appointments", icon: <Calendar size={20} /> },
    { label: "Upload CSV", path: "/upload-csv", icon: <FileUp size={20} /> },
    // { label: "Add Prompt", path: "/add-prompt", icon: <FileText size={20} /> },
    { label: "Agents Voice", path: "/voice", icon: <Mic size={20} /> },
    { label: "Prompts", path: "/settings", icon: <FileText size={20} /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex h-full">
      {/* ✅ Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 glass rounded-xl text-brand-primary active:scale-95 transition-all"
        onClick={() => setOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Container */}
      <div
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } fixed lg:static top-0 left-0 h-screen w-64 glass !bg-dark-bg/40 border-r border-white/5 transform lg:translate-x-0 transition-transform duration-500 ease-in-out z-50 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-8">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white">
            Paul<span className="text-brand-primary">.ai</span>
          </Link>
          <button
            className="lg:hidden p-2 text-white/50 hover:text-brand-accent transition-colors"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-2 py-4">
          <p className="px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group ${
                  isActive
                    ? "bg-brand-primary/10 text-white font-bold shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setOpen(false)}
              >
                <div className={`${isActive ? "text-brand-primary" : "text-gray-500 group-hover:text-brand-primary"} transition-colors duration-300`}>
                  {item.icon}
                </div>
                <span className="text-sm tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-6 bg-brand-primary rounded-r-full shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-gray-400 hover:text-brand-accent hover:bg-brand-accent/10 transition-all duration-300 font-bold text-sm tracking-tight cursor-pointer"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40 transition-opacity duration-500"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
