
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Calendar, 
  Home,
  Mic,
  Activity,
  Menu,
  Stethoscope
} from "lucide-react";
import { RecordingModal } from "./RecordingModal";

const navigationItems = [
  {
    icon: Home,
    label: "Início",
    href: "/dashboard"
  },
  {
    icon: Stethoscope,
    label: "Consultas",
    href: "/consultas"
  },
  {
    icon: Mic,
    label: "Gravar",
    href: null, // Special case for record button
    isRecordButton: true
  },
  {
    icon: Calendar,
    label: "Agenda",
    href: "/agenda"
  },
  {
    icon: Menu,
    label: "Mais",
    href: "/mais"
  }
];


export const BottomNavigation = () => {
  const location = useLocation();
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  
  const isActive = (href: string) => {
    // Handle both "/" and "/dashboard" as dashboard route
    if (href === "/dashboard" && (location.pathname === "/" || location.pathname === "/dashboard")) {
      return true;
    }
    return location.pathname === href;
  };

  const handleRecordClick = () => {
    setIsRecordingModalOpen(true);
  };


  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
        <div className="grid grid-cols-5 h-16 w-full relative">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            
            // Special handling for record button
            if (item.isRecordButton) {
              return (
                <div key="record-button" className="flex flex-col items-center justify-end h-full relative">
                  <motion.button
                    onClick={handleRecordClick}
                    className="absolute -top-6 w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center text-primary hover:text-primary/80 transition-colors shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.button>
                  <span className="text-xs font-medium text-muted-foreground mb-3">{item.label}</span>
                </div>
              );
            }
            
            // Regular navigation items
            const active = isActive(item.href!);
            
            return (
              <Link
                key={item.href}
                to={item.href!}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  active 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <RecordingModal
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
      />
    </>
  );
};
