import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "Consulta Cardiologista",
    date: "Hoje",
    time: "14:30",
    location: "Hospital São Lucas",
    type: "Consulta",
    urgent: false
  },
  {
    id: 2,
    title: "Exame de Sangue",
    date: "Amanhã", 
    time: "08:00",
    location: "Lab Exame",
    type: "Exame",
    urgent: true
  },
  {
    id: 3,
    title: "Retorno Ortopedista",
    date: "Sex, 15 Nov",
    time: "16:00", 
    location: "Clínica Movimento",
    type: "Retorno",
    urgent: false
  }
];

export const UpcomingEvents = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-inter text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Próximos Compromissos
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {upcomingEvents.map((event) => (
          <div 
            key={event.id}
            className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
          >
            <div className="mt-1">
              <div className={`w-3 h-3 rounded-full ${
                event.urgent ? 'bg-destructive' : 'bg-primary'
              }`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {event.title}
                </h4>
                <Badge 
                  variant={event.urgent ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {event.type}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{event.date}, {event.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};