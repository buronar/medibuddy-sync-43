import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRecordings } from "@/contexts/RecordingsContext";
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  Pill, 
  FileText, 
  CheckCircle, 
  Loader2, 
  Brain,
  User,
  ArrowRight,
  Bell,
  Plus,
  TestTube,
  CalendarCheck,
  HeartPulse
} from "lucide-react";

type Step = "selection" | "processing" | "results";

interface Consultation {
  id: string;
  date: string;
  doctor: string;
  duration: string;
  specialty: string;
}

interface AnalysisResult {
  summary: {
    duration: string;
    actions: number;
    accuracy: string;
  };
  medications: Array<{
    name: string;
    dose: string;
    frequency: string;
  }>;
  exams: Array<{
    name: string;
    type: string;
  }>;
  nextConsultation: {
    suggestedDate: string;
    reason: string;
  };
  guidelines: string[];
  clinicalInfo: {
    symptoms: string[];
    diagnosis: string;
  };
}

const Assistente = () => {
  const { id } = useParams<{ id: string }>();
  const { recordings } = useRecordings();
  const [currentStep, setCurrentStep] = useState<Step>("selection");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [processingSteps, setProcessingSteps] = useState([
    { label: "Enviando áudio", status: "pending" },
    { label: "Transcrevendo conversa", status: "pending" },
    { label: "Analisando com IA", status: "pending" },
    { label: "Gerando lembretes", status: "pending" }
  ]);

  // Mock data
  const consultations: Consultation[] = [
    {
      id: "1",
      date: "2024-01-20",
      doctor: "Dr. Carlos Silva",
      duration: "25 min",
      specialty: "Cardiologia"
    },
    {
      id: "2", 
      date: "2024-01-15",
      doctor: "Dra. Ana Santos",
      duration: "15 min",
      specialty: "Clínico Geral"
    },
    {
      id: "3",
      date: "2024-01-10",
      doctor: "Dr. Pedro Lima",
      duration: "30 min", 
      specialty: "Dermatologia"
    }
  ];


  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const analysisResult: AnalysisResult = {
    summary: {
      duration: selectedRecording?.duration || "25 min",
      actions: 7,
      accuracy: "94%"
    },
    medications: [
      { name: "Losartana", dose: "50mg", frequency: "1x ao dia" },
      { name: "Sinvastatina", dose: "20mg", frequency: "1x ao dia (noite)" }
    ],
    exams: [
      { name: "Hemograma Completo", type: "Sangue" },
      { name: "ECG", type: "Cardiológico" }
    ],
    nextConsultation: {
      suggestedDate: "2024-02-20",
      reason: "Acompanhar pressão arterial"
    },
    guidelines: [
      "Manter dieta com baixo teor de sódio",
      "Exercitar-se 30 min, 3x por semana", 
      "Monitorar pressão arterial diariamente"
    ],
    clinicalInfo: {
      symptoms: ["Dor no peito", "Falta de ar", "Fadiga"],
      diagnosis: "Hipertensão arterial leve"
    }
  };

  const handleAnalyze = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setCurrentStep("processing");
    startProcessing();
  };

  const startProcessing = () => {
    let currentProgress = 0;
    let stepIndex = 0;

    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);

      if (currentProgress === 25 || currentProgress === 50 || currentProgress === 75) {
        setProcessingSteps(prev => prev.map((step, index) => 
          index === stepIndex ? { ...step, status: "completed" } : step
        ));
        stepIndex++;
      }

      if (currentProgress === 90) {
        setProcessingSteps(prev => prev.map((step, index) => 
          index === stepIndex ? { ...step, status: "loading" } : step
        ));
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setProcessingSteps(prev => prev.map(step => ({ ...step, status: "completed" })));
        
        setTimeout(() => {
          setCurrentStep("results");
        }, 1000);
      }
    }, 300);
  };

  // Check if we have a recording ID and find the corresponding recording
  useEffect(() => {
    if (id && recordings.length > 0) {
      const recording = recordings.find(r => r.id === id);
      if (recording) {
        setSelectedRecording(recording);
        setCurrentStep("processing");
        startProcessing();
      }
    }
  }, [id, recordings]);

  const renderSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold mb-2 text-wrap break-words">
          Análise Inteligente de Consultas
        </h2>
        <p className="text-muted-foreground text-wrap break-words px-4">
          Selecione uma consulta para análise automática com IA
        </p>
      </div>

      <div className="space-y-4">
        {consultations.map((consultation) => (
          <Card key={consultation.id} className="w-full rounded-xl hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="font-medium text-wrap break-words">
                      {new Date(consultation.date).toLocaleDateString('pt-BR')}
                    </span>
                    <Badge variant="secondary" className="shrink-0">
                      {consultation.specialty}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-y-2 gap-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 shrink-0" />
                      <span className="text-wrap break-words">{consultation.doctor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 shrink-0" />
                      <span className="shrink-0">{consultation.duration}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleAnalyze(consultation)}
                  className="w-full sm:w-auto shrink-0"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Analisar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Brain className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
        <h2 className="text-2xl font-semibold mb-2">Processando com IA</h2>
        <p className="text-muted-foreground">
          {selectedRecording ? (
            <>Analisando consulta gravada em {formatDate(selectedRecording.timestamp)}</>
          ) : (
            <>Analisando consulta de {selectedConsultation?.date} com {selectedConsultation?.doctor}</>
          )}
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {processingSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                {step.status === "completed" && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {step.status === "loading" && (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                )}
                {step.status === "pending" && (
                  <div className="h-5 w-5 rounded-full border-2 border-muted" />
                )}
                
                <span className={`${
                  step.status === "completed" ? "text-foreground" : 
                  step.status === "loading" ? "text-primary" : 
                  "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
        <h2 className="text-xl font-semibold mb-2">Análise Concluída</h2>
        <p className="text-muted-foreground">
          {selectedRecording ? (
            <>Consulta gravada em {formatDate(selectedRecording.timestamp)} processada com sucesso</>
          ) : (
            <>Consulta de {selectedConsultation?.date} processada com sucesso</>
          )}
        </p>
      </div>

      {/* Resumo da Consulta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" aria-hidden="true" />
            Resumo da Consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{analysisResult.summary.duration}</div>
              <div className="text-xs text-muted-foreground">Duração</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{analysisResult.summary.actions}</div>
              <div className="text-xs text-muted-foreground">Ações Detectadas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{analysisResult.summary.accuracy}</div>
              <div className="text-xs text-muted-foreground">Precisão</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" aria-hidden="true" />
            Medicamentos Detectados
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="space-y-3">
            {analysisResult.medications.map((med, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">{med.name}</div>
                  <div className="text-sm text-muted-foreground">{med.dose} - {med.frequency}</div>
                </div>
                <Button size="sm" variant="outline">
                  <Bell className="h-4 w-4 mr-1" />
                  Lembrete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exames */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" aria-hidden="true" />
            Exames Solicitados
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="space-y-3">
            {analysisResult.exams.map((exam, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">{exam.name}</div>
                  <div className="text-sm text-muted-foreground">{exam.type}</div>
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Agendar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Próxima Consulta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            Próxima Consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium">
                {new Date(analysisResult.nextConsultation.suggestedDate).toLocaleDateString('pt-BR')}
              </div>
              <div className="text-sm text-muted-foreground">
                {analysisResult.nextConsultation.reason}
              </div>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Agendar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orientações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" aria-hidden="true" />
            Orientações Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="space-y-3">
            {analysisResult.guidelines.map((guideline, index) => (
              <div key={index} className="flex items-start gap-3">
                <ArrowRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span className="text-sm text-wrap break-words">{guideline}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informações Clínicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
            Informações Clínicas
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Sintomas Relatados:</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.clinicalInfo.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="secondary">{symptom}</Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-3">Diagnóstico:</h4>
              <p className="text-sm text-muted-foreground text-wrap break-words">{analysisResult.clinicalInfo.diagnosis}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-3">
        <Button className="flex-1">
          <CheckCircle className="h-4 w-4 mr-2" />
          Aceitar Sugestões
        </Button>
        <Button variant="outline" className="flex-1">
          Editar
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {currentStep === "selection" && renderSelection()}
      {currentStep === "processing" && renderProcessing()}
      {currentStep === "results" && renderResults()}
    </>
  );
};

export default Assistente;