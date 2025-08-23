import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation, Link } from "react-router-dom";
import { 
  Calendar, 
  FileText, 
  Mic, 
  Folder,
  Bot,
  Home
} from "lucide-react";

const navigationItems = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/dashboard"
  },
  {
    icon: Calendar,
    label: "Minhas Consultas",
    href: "/consultas"
  },
  {
    icon: Folder,
    label: "Meus Arquivos", 
    href: "/arquivos"
  },
  {
    icon: Calendar,
    label: "Agenda",
    href: "/agenda"
  },
  {
    icon: Bot,
    label: "IA Assistente",
    href: "/assistente"
  }
];

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className }: NavigationProps) => {
  const location = useLocation();
  
  const isActive = (href: string) => {
    // Handle both "/" and "/dashboard" as dashboard route
    if (href === "/dashboard" && (location.pathname === "/" || location.pathname === "/dashboard")) {
      return true;
    }
    return location.pathname === href;
  };

  return (
    <Card className={`p-4 ${className}`}>
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Button
              key={item.href}
              variant={active ? "default" : "ghost"}
              className="w-full justify-start gap-3 h-11"
              asChild
            >
              <Link to={item.href}>
                <Icon className="h-5 w-5" />
                <span className="font-inter font-medium">{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </nav>
    </Card>
  );
};