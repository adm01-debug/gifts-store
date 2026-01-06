import { useState } from "react";
import { Header } from "./Header";
import { SidebarReorganized } from "./SidebarReorganized";
import { PageTransition } from "@/components/effects";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { RestartTourButton } from "@/components/onboarding/RestartTourButton";
import { ExpertChatButton } from "@/components/expert/ExpertChatButton";
import { SkipToContent } from "@/components/common/SkipToContent";
import { Spotlight } from "@/components/common/Spotlight";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Accessibility: Skip to content link */}
      <SkipToContent />
      
      {/* Global Spotlight Search (Cmd+K) */}
      <Spotlight />
      
      {/* Onboarding Tour Overlay */}
      <OnboardingTour />
      
      <div className="flex">
        <SidebarReorganized 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <Header 
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <main id="main-content" className="flex-1 p-4 lg:p-6" role="main">
            <PageTransition variant="fade-slide" duration={0.25}>
              {children}
            </PageTransition>
          </main>
          
          {/* Restart Tour Button - fixed position */}
          <div className="fixed bottom-4 left-4 z-40">
            <RestartTourButton />
          </div>
          
          {/* Expert Chat Button - fixed position, mobile-friendly */}
          <ExpertChatButton />
        </div>
      </div>
    </div>
  );
}
