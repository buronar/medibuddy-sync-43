import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Mic, Activity } from "lucide-react";

const stats = [
  {
    icon: FileText,
    label: "Documentos",
    value: "24",
    description: "Este mês",
    color: "text-primary"
  },
  {
    icon: Calendar,
    label: "Consultas",
    value: "3",
    description: "Agendadas",
    color: "text-secondary"
  },
  {
    icon: Mic,
    label: "Áudios",
    value: "12",
    description: "Gravações",
    color: "text-accent-foreground"
  },
  {
    icon: Activity,
    label: "Lembretes",
    value: "5",
    description: "Ativos",
    color: "text-primary-light"
  }
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="bg-card/80 hover:bg-card transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-inter font-semibold text-lg text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground/70">
                    {stat.description}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};