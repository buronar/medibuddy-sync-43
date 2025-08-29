import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Clock, MapPin, User } from "lucide-react";
import { useConsultations } from "@/contexts/ConsultationsContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const REMINDER_LABELS = {
  '1day': '1 dia antes',
  '3hours': '3 horas antes',  
  '1hour': '1 hora antes'
};

export const Lembretes = () => {
  const { consultations } = useConsultations();
  const navigate = useNavigate();

  // Filtrar consultas futuras com lembretes
  const consultationsWithReminders = consultations
    .filter(consultation => {
      const isFuture = consultation.date > new Date();
      const hasReminders = consultation.reminders && consultation.reminders.length > 0;
      return isFuture && hasReminders;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm");
  };

  const formatReminderTime = (reminderDate: Date) => {
    return format(reminderDate, "dd/MM 'às' HH:mm");
  };

  return (
    <div className="container mx-auto p-4 pb-20 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Meus Lembretes
        </h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe todos os seus lembretes de consultas futuras
        </p>
      </motion.div>

      <div className="space-y-4">
        {consultationsWithReminders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum lembrete configurado</h3>
                <p className="text-muted-foreground mb-4">
                  Configure lembretes nas suas consultas futuras para não perder nenhum compromisso.
                </p>
                <Button onClick={() => navigate('/consultas')}>
                  Ver Consultas
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          consultationsWithReminders.map((consultation, index) => (
            <motion.div
              key={consultation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      {consultation.specialty}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {consultation.appointmentType === 'telemedicine' ? 'Telemedicina' : 'Presencial'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Informações da consulta */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(consultation.date)}</span>
                    </div>
                    {consultation.doctor && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Dr. {consultation.doctor}</span>
                      </div>
                    )}
                    {consultation.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{consultation.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Lembretes configurados */}
                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Lembretes configurados:</span>
                    </div>
                    <div className="space-y-1">
                      {consultation.reminders?.map((reminder) => (
                        <div key={reminder.id} className="flex items-center justify-between text-xs bg-secondary/50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{REMINDER_LABELS[reminder.type]}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              {formatReminderTime(reminder.scheduledTime)}
                            </span>
                            {reminder.delivered && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                ✓
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botão ver consulta */}
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/consultas/${consultation.id}`)}
                    className="w-full"
                  >
                    Ver Consulta
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};