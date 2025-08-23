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
  Download
} from "lucide-react";
import { useConsultations } from "@/contexts/ConsultationsContext";
import { useRecordings } from "@/contexts/RecordingsContext";
import { useFiles } from "@/contexts/FilesContext";
import { FileUploadSection } from "@/components/FileUploadSection";
import { useToast } from "@/hooks/use-toast";

const ConsultationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { consultations } = useConsultations();
  const { recordings } = useRecordings();
  const { getFilesByConsultation, deleteFile } = useFiles();
  const [showUpload, setShowUpload] = useState(false);

  const consultation = consultations.find(c => c.id === id);
  const consultationRecordings = recordings.filter(r => 
    consultation?.recordingId === r.id
  );
  const attachedFiles = consultation ? getFilesByConsultation(consultation.id) : [];

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

  const handleDownloadFile = (file: any) => {
    toast({
      title: "Download iniciado",
      description: `Simulando download de ${file.name}`,
    });
  };

  const handleDeleteFile = (fileId: string) => {
    deleteFile(fileId);
    toast({
      title: "Arquivo excluído",
      description: "O arquivo foi removido com sucesso.",
    });
  };

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
        {/* Informações da Consulta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          transition={{ delay: 0.2 }}
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

        {/* Arquivos Anexados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Arquivos Anexados ({attachedFiles.length})
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowUpload(!showUpload)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Anexar Arquivo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showUpload && (
                <FileUploadSection
                  consultationId={consultation.id}
                  onUploadComplete={() => setShowUpload(false)}
                />
              )}

              {attachedFiles.length > 0 ? (
                <div className="space-y-3">
                  {attachedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{file.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <Badge variant="secondary" className="text-xs">
                            {file.type.toUpperCase()}
                          </Badge>
                          <span>{formatDate(file.uploadDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadFile(file)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteFile(file.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum arquivo anexado a esta consulta
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ConsultationDetails;