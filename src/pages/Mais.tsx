import { PageTransition } from "@/components/PageTransition";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Settings, 
  HelpCircle, 
  FileText, 
  Shield,
  LogOut,
  Calendar,
  Activity,
  Pill
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    icon: Calendar,
    label: "Minhas Consultas",
    href: "/consultas",
    description: "Gerencie suas consultas médicas"
  },
  {
    icon: Activity,
    label: "Assistente Inteligente",
    href: "/assistente",
    description: "IA para análise de consultas"
  },
  {
    icon: Pill,
    label: "Meus Medicamentos",
    href: "/medicamentos",
    description: "Gerencie seus medicamentos e receitas"
  },
  {
    icon: User,
    label: "Meu Perfil",
    href: "/perfil",
    description: "Gerencie suas informações pessoais"
  },
  {
    icon: FileText,
    label: "Meus Arquivos", 
    href: "/arquivos",
    description: "Documentos e exames médicos"
  },
  {
    icon: Settings,
    label: "Configurações",
    href: "#",
    description: "Ajustes do aplicativo"
  },
  {
    icon: Shield,
    label: "Privacidade",
    href: "#", 
    description: "Controle de dados e privacidade"
  },
  {
    icon: HelpCircle,
    label: "Ajuda e Suporte",
    href: "#",
    description: "Central de ajuda e contato"
  }
];

export const Mais = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    signOut();
  };

  return (
    <PageTransition location={location.pathname}>
      <div className="flex-1 space-y-6">
        <div className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Card key={item.label} className="border-l-4 border-l-primary">
                <Link 
                  to={item.href}
                  className="block hover:bg-accent/50 transition-colors"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
          
          {/* Logout button */}
          <Card className="border-l-4 border-l-destructive">
            <button 
              onClick={handleLogout}
              className="w-full text-left hover:bg-destructive/5 transition-colors"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="bg-destructive/10 p-3 rounded-full">
                  <LogOut className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive">Sair da Conta</h3>
                  <p className="text-sm text-muted-foreground">Fazer logout do aplicativo</p>
                </div>
              </CardContent>
            </button>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};