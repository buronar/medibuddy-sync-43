import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const Perfil = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      
      <div className="flex">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden md:block w-64 min-h-screen p-4 bg-muted/30">
          <Navigation />
        </aside>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-64 bg-background p-4">
              <Navigation />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="font-inter font-bold text-2xl md:text-3xl text-foreground">
                Perfil
              </h1>
              <p className="text-muted-foreground">
                Gerencie suas informações pessoais e configurações
              </p>
            </div>

            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Configurações do perfil serão implementadas em breve
              </p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Perfil;