import { useState, ReactNode } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { BottomNavigation } from "@/components/BottomNavigation";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AppLayout = ({ children, title, subtitle }: AppLayoutProps) => {
  const hasBrand = title.includes("SaúdeSync");
  const parts = title.split("SaúdeSync");
  return (
    <div className="min-h-screen bg-background font-inter overflow-x-hidden">
      <Header />
      
      <div className="flex">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden md:block w-64 min-h-screen p-4 bg-muted/30">
          <Navigation />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <div className="space-y-6">
            <div className="space-y-3 md:space-y-4">
              <h1 className="font-inter font-bold text-2xl md:text-3xl text-foreground">
                {hasBrand ? (
                  <>
                    {parts[0]}
                    <span className="text-primary">SaúdeSync</span>
                    {parts.slice(1).join("SaúdeSync")}
                  </>
                ) : (
                  title
                )}
              </h1>
              <p className="text-foreground/80">
                {subtitle}
              </p>
            </div>

            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};