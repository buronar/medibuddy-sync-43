import { useEffect, useCallback } from 'react';
import { useConsultations } from '@/contexts/ConsultationsContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useReminders = () => {
  const { consultations, updateConsultation } = useConsultations();
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkReminders = useCallback(() => {
    const now = new Date();
    
    consultations.forEach(consultation => {
      if (!consultation.reminders) return;
      
      consultation.reminders.forEach(reminder => {
        if (!reminder.delivered && reminder.scheduledTime <= now) {
          // Marcar como entregue
          const updatedReminders = consultation.reminders!.map(r =>
            r.id === reminder.id ? { ...r, delivered: true } : r
          );
          
          updateConsultation(consultation.id, { reminders: updatedReminders });

          // Exibir notificação
          const reminderText = getReminderText(consultation.specialty, consultation.date, reminder.type);
          
          toast({
            title: "🔔 Lembrete de Consulta",
            description: reminderText,
            action: (
              <button 
                onClick={() => navigate(`/consultas/${consultation.id}`)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Ver consulta
              </button>
            ),
            duration: 8000, // 8 segundos para dar tempo de ver
          });
        }
      });
    });
  }, [consultations, updateConsultation, toast, navigate]);

  const getReminderText = (specialty: string, date: Date, type: string) => {
    const timeFormat = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);

    const dateFormat = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    }).format(date);

    switch (type) {
      case '1day':
        return `📅 Você tem uma consulta de ${specialty} amanhã às ${timeFormat}`;
      case '3hours':
        return `⏰ Sua consulta de ${specialty} será às ${timeFormat}, se prepare`;
      case '1hour':
        return `🚨 Sua consulta de ${specialty} é em 1 hora (${timeFormat})`;
      default:
        return `Lembrete: Consulta de ${specialty} em ${dateFormat} às ${timeFormat}`;
    }
  };

  useEffect(() => {
    // Verificar lembretes a cada 30 segundos
    const interval = setInterval(checkReminders, 30000);
    
    // Verificação inicial
    checkReminders();
    
    return () => clearInterval(interval);
  }, [checkReminders]);

  return {
    checkReminders
  };
};