import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, FileText, Video, Upload } from "lucide-react";

const quickActions = [
  {
    icon: Camera,
    label: "Foto",
    description: "Receitas, laudos",
    color: "bg-secondary/10 text-secondary border-secondary/20"
  },
  {
    icon: FileText,
    label: "PDF",
    description: "Exames, prontuários", 
    color: "bg-primary/10 text-primary border-primary/20"
  },
  {
    icon: Video,
    label: "Vídeo",
    description: "Orientações médicas",
    color: "bg-accent text-accent-foreground border-accent"
  }
];

export const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-inter text-lg flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Carregar Arquivos
        </CardTitle>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant="outline"
              className={`h-20 flex-col gap-2 ${action.color} hover:scale-105 transition-transform`}
            >
              <Icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};