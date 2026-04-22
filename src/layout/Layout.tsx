import { useState } from "react";
import Sidebar from "../components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Persistent Mesh Gradients - Adjusted for light theme */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-secondary/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/5 blur-[120px] animate-pulse-slow" />
      </div>

      {/* Fixed Sidebar */}
      <div className={`fixed top-0 left-0 h-screen z-50 transition-all duration-500 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Main Content (scrollable) */}
      <main className={`flex-1 min-h-screen relative p-6 overflow-y-auto selection:bg-brand-primary/30 transition-all duration-500 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;