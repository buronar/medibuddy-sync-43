import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Play, Square } from "lucide-react";
import { useState } from "react";

export const RecordingCard = () => {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
          <Mic className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-inter text-xl text-foreground">
          Gravar Consulta
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Inicie a gravação durante sua consulta médica para não perder nenhuma orientação importante
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button
          onClick={handleRecordToggle}
          className={`w-full h-12 font-inter font-medium ${
            isRecording 
              ? "bg-destructive hover:bg-destructive/90" 
              : "bg-primary hover:bg-primary-dark"
          }`}
        >
          {isRecording ? (
            <>
              <Square className="h-5 w-5 mr-2" />
              Parar Gravação
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Iniciar Gravação
            </>
          )}
        </Button>
        
        {isRecording && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 bg-destructive rounded-full animate-pulse"></div>
            <span>Gravando...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};