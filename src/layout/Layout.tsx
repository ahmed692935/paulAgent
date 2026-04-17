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
    <div className="flex w-full min-h-screen bg-dark-bg relative overflow-hidden">
      {/* Persistent Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-secondary/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/10 blur-[120px] animate-pulse-slow" />
      </div>

      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 z-50">
        <Sidebar />
      </div>

      {/* Main Content (scrollable) */}
      <main className="lg:ml-64 flex-1 min-h-screen relative z-10 p-6 overflow-y-auto selection:bg-brand-primary/30">
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
