import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Check } from "lucide-react";
import { useConsultations } from "@/contexts/ConsultationsContext";
import { useToast } from "@/hooks/use-toast";

interface PatientNotesSectionProps {
  consultationId: string;
}

export const PatientNotesSection = ({ consultationId }: PatientNotesSectionProps) => {
  const { consultations, updateConsultation } = useConsultations();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const consultation = consultations.find(c => c.id === consultationId);

  useEffect(() => {
    if (consultation?.patientNotes) {
      setNotes(consultation.patientNotes);
    }
  }, [consultation?.patientNotes]);

  const saveNotes = async (noteText: string) => {
    if (!consultation) return;

    setIsSaving(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateConsultation(consultationId, { patientNotes: noteText });
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    
    // Debounced auto-save
    const timeoutId = setTimeout(() => {
      saveNotes(value);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const formatSaveTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas do Paciente
            </CardTitle>
            <div className="flex items-center gap-2">
              {isSaving && (
                <Badge variant="secondary" className="text-xs">
                  Salvando...
                </Badge>
              )}
              {lastSaved && !isSaving && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Salvo às {formatSaveTime(lastSaved)}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Adicione suas observações pessoais sobre a consulta, sintomas sentidos, perguntas para o próximo retorno, etc."
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Suas notas são salvas automaticamente e ficam visíveis apenas para você.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};