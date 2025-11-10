// import Sidebar from "../components/Sidebar";

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   return (
//     <div className="flex !w-full">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main content */}
//       <main className="w-[92%] p-6 bg-gray-100">{children}</main>
//     </div>
//   );
// };

// export default Layout;

import Sidebar from "../components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex w-full">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 z-50">
        <Sidebar />
      </div>

      {/* Main Content (scrollable) */}
      <main className="lg:ml-64 flex-1 min-h-screen overflow-y-auto bg-[#fafafa] p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;

// import Sidebar from "../components/Sidebar";
// interface LayoutProps {
//   children: React.ReactNode;
// }
// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   return (
//     <div className="flex min-h-screen">
//       {" "}
//       {/* Sidebar */} <Sidebar /> {/* Main content */}{" "}
//       <main className="w-full p-6 bg-gray-100">{children}</main>{" "}
//     </div>
//   );
// };
// export default Layout;
