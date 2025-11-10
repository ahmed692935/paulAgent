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
import { BiMenu, BiX } from "react-icons/bi";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import Logo from "../../public/images/sumaLogo.png";
import { logout } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Initiate Call", path: "/call" },
    { label: "Add Prompt", path: "/add-prompt" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* ✅ Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-1 left-1 z-50 p-2 rounded-md"
        onClick={() => setOpen(true)}
      >
        <BiMenu size={24} />
      </button>
      <div
        className={`${open ? "translate-x-0" : "-translate-x-full"
          } fixed lg:static top-0 left-0 min-h-[100vh] w-64 text-black transform lg:translate-x-0 transition-transform duration-300 z-50 bg-blue-900 pt-3`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {/* <img src={Logo} width={150} /> */}
          <p className="text-5xl font-bold text-white mx-5">Paul</p>
          <button
            className="lg:hidden text-white cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <BiX size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 pt-4 pl-1 relative">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded relative transition-all text-white hover:text-black duration-200 pl-5 ${isActive
                  ? "bg-blue-500 text-[#fff] font-semibold hover:text-white"
                  : "text-black hover:bg-white"
                  }`}
                onClick={() => setOpen(false)}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-white rounded-r"></div>
                )}
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded text-left text-white hover:text-black hover:bg-white pl-5 cursor-pointer transition-all duration-200"
          >
            Logout
          </button>
        </nav>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;