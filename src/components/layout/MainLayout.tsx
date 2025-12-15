import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { PageTransition } from "@/components/effects";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <Header 
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <main className="flex-1 p-4 lg:p-6">
            <PageTransition variant="fade-slide" duration={0.25}>
              {children}
            </PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
