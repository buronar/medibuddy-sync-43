import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Stethoscope, Mic, Play, Calendar, Trash2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useConsultations } from "@/contexts/ConsultationsContext";
import { useRecordings } from "@/contexts/RecordingsContext";
import { CreateConsultationModal } from "./CreateConsultationModal";
import { RecordingModal } from "./RecordingModal";
import { useToast } from "@/hooks/use-toast";

export const ConsultationsList = () => {
  const navigate = useNavigate();
  const { consultations, deleteConsultation } = useConsultations();
  const { recordings } = useRecordings();
  const { toast } = useToast();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [recordingModalOpen, setRecordingModalOpen] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleStartRecording = (consultationId: string) => {
    setSelectedConsultationId(consultationId);
    setRecordingModalOpen(true);
  };

  const handlePlayRecording = (recordingId: string) => {
    const recording = recordings.find(r => r.id === recordingId);
    if (recording) {
      toast({
        title: "Reproduzindo gravação",
        description: `Simulando reprodução de ${recording.filename}`,
      });
    }
  };

  const handleDeleteConsultation = (id: string) => {
    deleteConsultation(id);
    toast({
      title: "Consulta excluída",
      description: "A consulta foi removida com sucesso.",
    });
  };

  if (consultations.length === 0) {
    return (
      <>
        <Card className="text-center py-12">
          <CardContent>
            <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma consulta encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Crie sua primeira consulta para começar a organizar suas visitas médicas.
            </p>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Nova Consulta
            </Button>
          </CardContent>
        </Card>

        <CreateConsultationModal 
          isOpen={createModalOpen} 
          onClose={() => setCreateModalOpen(false)} 
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Consultas ({consultations.length})</h2>
        <Button onClick={() => setCreateModalOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Consulta
        </Button>
      </div>

      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {consultations.map((consultation, index) => {
          const associatedRecording = consultation.recordingId 
            ? recordings.find(r => r.id === consultation.recordingId)
            : null;

          return (
            <motion.div
              key={consultation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/consultas/${consultation.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-medium text-sm">Dr. {consultation.doctor}</h3>
                        <p className="text-xs text-muted-foreground">{consultation.specialty}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(consultation.date)}</span>
                      </div>

                      {consultation.notes && (
                        <p className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
                          {consultation.notes}
                        </p>
                      )}

                      {associatedRecording && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-2 rounded">
                          <Mic className="h-3 w-3" />
                          <span>Gravação: {associatedRecording.filename}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {associatedRecording ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayRecording(associatedRecording.id);
                          }}
                          className="h-8 w-8 p-0"
                          title="Ouvir gravação"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartRecording(consultation.id);
                          }}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="Gravar consulta"
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConsultation(consultation.id);
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        title="Ver detalhes"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <CreateConsultationModal 
        isOpen={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />

      <RecordingModal 
        isOpen={recordingModalOpen} 
        onClose={() => {
          setRecordingModalOpen(false);
          setSelectedConsultationId(null);
        }}
        consultationId={selectedConsultationId}
      />
    </div>
  );
};