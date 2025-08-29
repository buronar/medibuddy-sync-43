import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  FileText, 
  Mic, 
  Play, 
  Upload,
  Trash2,
  Download,
  CheckCircle,
  X,
  AlertCircle
} from "lucide-react";
import { useConsultations } from "@/contexts/ConsultationsContext";
import { useRecordings } from "@/contexts/RecordingsContext";
import { useFiles } from "@/contexts/FilesContext";
import { CategorizedFilesSection } from "@/components/CategorizedFilesSection";
import { PatientNotesSection } from "@/components/PatientNotesSection";
import { AIAnalysisSection } from "@/components/AIAnalysisSection";
import { ReminderSettings } from "@/components/ReminderSettings";
import { useToast } from "@/hooks/use-toast";

const ConsultationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { consultations, updateConsultation } = useConsultations();
  const { recordings } = useRecordings();
  const { getFilesByConsultation } = useFiles();

  const consultation = consultations.find(c => c.id === id);
  const consultationRecordings = recordings.filter(r => 
    consultation?.recordingId === r.id
  );

  if (!consultation) {
    return (
      <div className="container mx-auto p-4 pb-20">
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium mb-2">Consulta não encontrada</h3>
            <p className="text-muted-foreground mb-4">
              A consulta que você procura não existe.
            </p>
            <Button onClick={() => navigate('/consultas')}>
              Voltar para Consultas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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


  const handleMarkAsCompleted = () => {
    if (consultation) {
      updateConsultation(consultation.id, { status: 'Realizada' });
      toast({
        title: "Consulta confirmada",
        description: "A consulta foi marcada como realizada."
      });
    }
  };

  const handleMarkAsNoShow = () => {
    if (consultation) {
      updateConsultation(consultation.id, { status: 'Não Compareceu' });
      toast({
        title: "Consulta marcada",
        description: "A consulta foi marcada como não compareceu."
      });
    }
  };

  const isConsultationPending = consultation && consultation.status === 'A Confirmar';

  return (
    <div className="container mx-auto p-4 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/consultas')}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{consultation.specialty}</h1>
          <p className="text-sm text-muted-foreground">
            Detalhes da consulta
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Status da Consulta - Botões de Confirmação */}
        {isConsultationPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <AlertCircle className="h-5 w-5" />
                  Confirmar Consulta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-700 mb-4">
                  Esta consulta já passou. Você pode confirmar se ela aconteceu ou não.
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleMarkAsCompleted}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Realizada
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleMarkAsNoShow}
                    className="border-red-200 text-red-700 hover:bg-red-50 flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Não Compareci
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Informações da Consulta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isConsultationPending ? 0.2 : 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações da Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Médico:</span>
                    <span>{consultation.doctor || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Data e Hora:</span>
                    <span>{formatDate(consultation.date)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-medium">Local:</span>
                      <p className="text-muted-foreground">{consultation.address}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {consultation.notes && (
                <>
                  <Separator />
                  <div>
                    <span className="font-medium text-sm">Observações:</span>
                    <p className="text-sm text-muted-foreground mt-1 bg-secondary/50 p-3 rounded">
                      {consultation.notes}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Gravações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isConsultationPending ? 0.3 : 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Gravações da Consulta
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consultationRecordings.length > 0 ? (
                <div className="space-y-3">
                  {consultationRecordings.map((recording) => (
                    <div
                      key={recording.id}
                      className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mic className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{recording.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          Duração: {recording.duration} • {formatDate(recording.timestamp)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePlayRecording(recording.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mic className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma gravação encontrada para esta consulta
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Arquivos Anexados Categorizados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isConsultationPending ? 0.4 : 0.3 }}
        >
          <CategorizedFilesSection consultationId={consultation.id} />
        </motion.div>

        {/* Notas do Paciente */}
        <PatientNotesSection consultationId={consultation.id} />

        {/* Configurações de Lembretes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ReminderSettings consultation={consultation} />
        </motion.div>

        {/* Análise Inteligente da Consulta */}
        <AIAnalysisSection consultationId={consultation.id} />
      </div>
    </div>
  );
};

export default ConsultationDetails;