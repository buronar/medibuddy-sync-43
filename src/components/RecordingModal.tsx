
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { motion } from "framer-motion";
import { useRecordings } from "@/contexts/RecordingsContext";
import { useConsultations } from "@/contexts/ConsultationsContext";

type RecordingState = "pre-recording" | "recording" | "finished";

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId?: string | null;
}

export const RecordingModal = ({ isOpen, onClose, consultationId }: RecordingModalProps) => {
  const { addRecording } = useRecordings();
  
  // Only use consultations context if consultationId is provided
  let associateRecording: ((consultationId: string, recordingId: string) => void) | undefined;
  try {
    const consultationsContext = useConsultations();
    associateRecording = consultationsContext.associateRecording;
  } catch {
    // Context not available, this is fine for the old recording flow
    associateRecording = undefined;
  }
  const [state, setState] = useState<RecordingState>("pre-recording");
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Format time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = () => {
    setState("recording");
    setSeconds(0);
    
    const id = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    setIntervalId(id);
  };

  // Stop recording
  const stopRecording = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    const recordingId = Date.now().toString();
    const recording = {
      id: recordingId,
      filename: `consulta-${String(Date.now()).slice(-4)}.m4a`,
      duration: formatTime(seconds),
      timestamp: new Date(),
      user: "Dr. Silva" // Mock user
    };
    
    addRecording(recording);
    
    // Associate recording with consultation if consultationId is provided and context is available
    if (consultationId && associateRecording) {
      associateRecording(consultationId, recordingId);
    }
    
    setState("finished");
  };

  // Close modal and reset state
  const handleClose = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setState("pre-recording");
    setSeconds(0);
    onClose();
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {state === "pre-recording" && "Gravar Consulta"}
            {state === "recording" && "Gravação em Andamento"}
            {state === "finished" && "Gravação Finalizada"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Pre-recording state */}
          {state === "pre-recording" && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground px-4">
                Inicie a gravação durante sua consulta médica para não perder nenhuma orientação importante.
              </p>
              <Button onClick={startRecording} className="w-full">
                <Mic className="h-4 w-4 mr-2" />
                Iniciar Gravação
              </Button>
            </div>
          )}

          {/* Recording state */}
          {state === "recording" && (
            <div className="text-center space-y-4">
              <motion.div 
                className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Mic className="h-8 w-8 text-destructive" />
              </motion.div>
              
              <div className="space-y-2">
                <div className="text-2xl font-mono font-bold text-destructive">
                  {formatTime(seconds)}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 bg-destructive rounded-full animate-pulse"></div>
                  <span>Gravando...</span>
                </div>
              </div>

              <Button 
                onClick={stopRecording}
                variant="destructive"
                className="w-full"
              >
                <Square className="h-4 w-4 mr-2" />
                Finalizar Gravação
              </Button>
            </div>
          )}

          {/* Finished state */}
          {state === "finished" && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mic className="h-8 w-8 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-green-600">
                  Gravação salva com sucesso
                </p>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <p className="text-sm font-medium">
                    {`consulta-${String(Date.now()).slice(-4)}.m4a`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Duração: {formatTime(seconds)}
                  </p>
                </div>
              </div>

              <Button onClick={handleClose} className="w-full">
                Fechar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
