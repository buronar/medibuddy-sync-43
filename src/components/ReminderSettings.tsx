import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Plus, Trash2 } from "lucide-react";
import { useConsultations, type Consultation } from "@/contexts/ConsultationsContext";
import { useToast } from "@/hooks/use-toast";

interface ReminderSettingsProps {
  consultation: Consultation;
}

const REMINDER_LABELS = {
  '1day': '1 dia antes',
  '3hours': '3 horas antes',  
  '1hour': '1 hora antes'
};

export const ReminderSettings = ({ consultation }: ReminderSettingsProps) => {
  const { addReminder, removeReminder } = useConsultations();
  const { toast } = useToast();
  const [newReminderType, setNewReminderType] = useState<'1day' | '3hours' | '1hour'>('1day');

  const isPastConsultation = consultation.date < new Date();
  const existingReminderTypes = (consultation.reminders || []).map(r => r.type);

  const handleAddReminder = () => {
    if (existingReminderTypes.includes(newReminderType)) {
      toast({
        title: "Lembrete já existe",
        description: "Esse tipo de lembrete já está configurado.",
        variant: "destructive"
      });
      return;
    }

    addReminder(consultation.id, newReminderType);
    toast({
      title: "Lembrete adicionado",
      description: `Lembrete de ${REMINDER_LABELS[newReminderType]} configurado.`
    });
  };

  const handleRemoveReminder = (reminderType: '1day' | '3hours' | '1hour') => {
    removeReminder(consultation.id, reminderType);
    toast({
      title: "Lembrete removido",
      description: `Lembrete de ${REMINDER_LABELS[reminderType]} foi removido.`
    });
  };

  if (isPastConsultation) {
    return null;
  }

  const availableTypes = (['1day', '3hours', '1hour'] as const).filter(
    type => !existingReminderTypes.includes(type)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Lembretes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lembretes existentes */}
        {consultation.reminders && consultation.reminders.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Lembretes configurados:</p>
            <div className="flex flex-wrap gap-2">
              {consultation.reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {REMINDER_LABELS[reminder.type]}
                    {reminder.delivered && " ✓"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveReminder(reminder.type)}
                    className="h-6 w-6 p-0 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adicionar novo lembrete */}
        {availableTypes.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Adicionar lembrete:</p>
            <div className="flex gap-2">
              <Select 
                value={newReminderType} 
                onValueChange={(value: '1day' | '3hours' | '1hour') => setNewReminderType(value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {REMINDER_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddReminder} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {consultation.reminders?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Nenhum lembrete configurado
          </p>
        )}
      </CardContent>
    </Card>
  );
};