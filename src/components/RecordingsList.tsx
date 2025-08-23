import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AudioLines, Play, Trash2, Edit3, Brain } from "lucide-react";
import { useRecordings, Recording } from "@/contexts/RecordingsContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const RecordingsList = () => {
  const { recordings, deleteRecording, updateRecording } = useRecordings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [recordingToRename, setRecordingToRename] = useState<Recording | null>(null);
  const [newFilename, setNewFilename] = useState("");

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handlePlayRecording = (recording: Recording) => {
    console.log('ouvir', recording.filename);
    toast({
      title: "Reproduzindo gravação",
      description: `Simulando reprodução de ${recording.filename}`,
    });
  };

  const handleDeleteRecording = (id: string) => {
    deleteRecording(id);
    toast({
      title: "Gravação excluída",
      description: "A gravação foi removida com sucesso.",
    });
  };

  const handleRenameClick = (recording: Recording) => {
    setRecordingToRename(recording);
    setNewFilename(recording.filename.replace('.m4a', ''));
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = () => {
    if (recordingToRename && newFilename.trim()) {
      const updatedFilename = newFilename.trim().endsWith('.m4a') 
        ? newFilename.trim() 
        : `${newFilename.trim()}.m4a`;
      
      updateRecording(recordingToRename.id, { filename: updatedFilename });
      
      toast({
        title: "Gravação renomeada",
        description: `Arquivo renomeado para ${updatedFilename}`,
      });
      
      setRenameDialogOpen(false);
      setRecordingToRename(null);
      setNewFilename("");
    }
  };

  const handleAnalyzeWithAI = (recording: Recording) => {
    navigate(`/assistente/${recording.id}`);
  };

  if (recordings.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <AudioLines className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma gravação encontrada</h3>
          <p className="text-muted-foreground">
            Use o botão "Gravar" na barra inferior para fazer sua primeira gravação.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Gravações ({recordings.length})</h2>
      </div>

      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {recordings.map((recording, index) => (
          <motion.div
            key={recording.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <AudioLines className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium text-sm">{recording.filename}</h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Duração: {recording.duration}</span>
                      <span>{formatDate(recording.timestamp)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePlayRecording(recording)}
                      className="h-8 w-8 p-0"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRenameClick(recording)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAnalyzeWithAI(recording)}
                      className="h-8 w-8 p-0"
                      title="Analisar com IA"
                    >
                      <Brain className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteRecording(recording.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renomear Gravação</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filename">Nome do arquivo</Label>
              <Input
                id="filename"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                placeholder="Digite o novo nome"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRenameConfirm}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};