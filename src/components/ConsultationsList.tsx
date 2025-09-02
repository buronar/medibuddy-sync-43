import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Stethoscope, Mic, Play, Calendar, Trash2, ChevronRight, Clock, CheckCircle, CalendarClock, AlertCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useConsultations, type Consultation } from "@/contexts/ConsultationsContext";
import { useRecordings } from "@/contexts/RecordingsContext";
import { CreateConsultationModal } from "./CreateConsultationModal";
import { RecordingModal } from "./RecordingModal";
import { ConfirmationNudge } from "./ConfirmationNudge";
import { useToast } from "@/hooks/use-toast";
type StatusFilter = 'todas' | 'proximas' | 'aguardando' | 'aconfirmar' | 'realizadas' | 'naocompareceu';
interface GroupedConsultations {
  proximas: Consultation[];
  aguardando: Consultation[];
  aconfirmar: Consultation[];
  realizadas: Consultation[];
  naocompareceu: Consultation[];
}
export const ConsultationsList = () => {
  const navigate = useNavigate();
  const {
    consultations,
    deleteConsultation
  } = useConsultations();
  const {
    recordings
  } = useRecordings();
  const {
    toast
  } = useToast();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [recordingModalOpen, setRecordingModalOpen] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  const groupConsultations = (consultations: Consultation[]): GroupedConsultations => {
    const proximas: Consultation[] = [];
    const aguardando: Consultation[] = [];
    const aconfirmar: Consultation[] = [];
    const realizadas: Consultation[] = [];
    const naocompareceu: Consultation[] = [];
    
    consultations.forEach(consultation => {
      if (!consultation.date) {
        aguardando.push(consultation);
      } else if (consultation.status === 'Realizada') {
        realizadas.push(consultation);
      } else if (consultation.status === 'Não Compareceu') {
        naocompareceu.push(consultation);
      } else if (consultation.status === 'A Confirmar') {
        aconfirmar.push(consultation);
      } else {
        proximas.push(consultation);
      }
    });

    // Ordenação
    proximas.sort((a, b) => a.date.getTime() - b.date.getTime());
    aconfirmar.sort((a, b) => b.date.getTime() - a.date.getTime());
    realizadas.sort((a, b) => b.date.getTime() - a.date.getTime());
    naocompareceu.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return {
      proximas,
      aguardando,
      aconfirmar,
      realizadas,
      naocompareceu
    };
  };
  const groupedConsultations = groupConsultations(consultations);
  const getFilteredConsultations = () => {
    const emptyGroups = {
      proximas: [],
      aguardando: [],
      aconfirmar: [],
      realizadas: [],
      naocompareceu: []
    };
    
    switch (statusFilter) {
      case 'proximas':
        return { ...emptyGroups, proximas: groupedConsultations.proximas };
      case 'aguardando':
        return { ...emptyGroups, aguardando: groupedConsultations.aguardando };
      case 'aconfirmar':
        return { ...emptyGroups, aconfirmar: groupedConsultations.aconfirmar };
      case 'realizadas':
        return { ...emptyGroups, realizadas: groupedConsultations.realizadas };
      case 'naocompareceu':
        return { ...emptyGroups, naocompareceu: groupedConsultations.naocompareceu };
      default:
        return groupedConsultations;
    }
  };
  const filteredGroups = getFilteredConsultations();
  const handleStartRecording = (consultationId: string) => {
    setSelectedConsultationId(consultationId);
    setRecordingModalOpen(true);
  };
  const handlePlayRecording = (recordingId: string) => {
    const recording = recordings.find(r => r.id === recordingId);
    if (recording) {
      toast({
        title: "Reproduzindo gravação",
        description: `Simulando reprodução de ${recording.filename}`
      });
    }
  };
  const handleDeleteConsultation = (id: string) => {
    deleteConsultation(id);
    toast({
      title: "Consulta excluída",
      description: "A consulta foi removida com sucesso."
    });
  };
  const renderConsultationCard = (consultation: Consultation, index: number) => {
    const associatedRecording = consultation.recordingId ? recordings.find(r => r.id === consultation.recordingId) : null;
    return <motion.div key={consultation.id} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: index * 0.1
    }}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/consultas/${consultation.id}`)}>
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
                
                {consultation.date && <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(consultation.date)}</span>
                  </div>}

                {consultation.notes && <p className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
                    {consultation.notes}
                  </p>}

                {associatedRecording && <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-2 rounded">
                    <Mic className="h-3 w-3" />
                    <span>Gravação: {associatedRecording.filename}</span>
                  </div>}
              </div>

              <div className="flex items-center gap-1">
                {associatedRecording ? <Button size="sm" variant="ghost" onClick={e => {
                e.stopPropagation();
                handlePlayRecording(associatedRecording.id);
              }} className="h-8 w-8 p-0" title="Ouvir gravação">
                    <Play className="h-4 w-4" />
                  </Button> : <Button size="sm" variant="ghost" onClick={e => {
                e.stopPropagation();
                handleStartRecording(consultation.id);
              }} className="h-8 w-8 p-0 text-red-600 hover:text-red-700" title="Gravar consulta">
                    <Mic className="h-4 w-4" />
                  </Button>}
                
                <Button size="sm" variant="ghost" onClick={e => {
                e.stopPropagation();
                handleDeleteConsultation(consultation.id);
              }} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>

                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Ver detalhes">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>;
  };
  const renderGroupSection = (title: string, consultations: Consultation[], icon: React.ReactNode, emptyMessage: string, showNudge: boolean = false) => {
    if (consultations.length === 0) return null;
    return <section className="w-full rounded-xl border bg-card overflow-hidden">
        <div className="px-4 py-3">
          <div className="text-base font-semibold flex items-center gap-2">
            {icon}
            {title} ({consultations.length})
          </div>
        </div>
        <div className="px-4 pb-4">
          <motion.div className="space-y-3" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          staggerChildren: 0.1
        }}>
            {showNudge && consultations.map((consultation, index) => 
              consultation.status === 'A Confirmar' ? (
                <ConfirmationNudge key={`nudge-${consultation.id}`} consultation={consultation} />
              ) : null
            )}
            {consultations.map((consultation, index) => renderConsultationCard(consultation, index))}
          </motion.div>
        </div>
      </section>;
  };
  if (consultations.length === 0) {
    return <div className="w-full">
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

        <CreateConsultationModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      </div>;
  }
  return <div className="w-full space-y-6">
      {/* Header com filtros */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold">Consultas ({consultations.length})</h2>
          <Button onClick={() => setCreateModalOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Consulta
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant={statusFilter === 'todas' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('todas')} className="h-8">
            Todas
          </Button>
          <Button variant={statusFilter === 'proximas' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('proximas')} className="h-8">
            <Clock className="h-3 w-3 mr-1" />
            Próximas ({groupedConsultations.proximas.length})
          </Button>
          <Button variant={statusFilter === 'aguardando' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('aguardando')} className="h-8">
            <CalendarClock className="h-3 w-3 mr-1" />
            Aguardando Data ({groupedConsultations.aguardando.length})
          </Button>
          <Button variant={statusFilter === 'aconfirmar' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('aconfirmar')} className="h-8">
            <AlertCircle className="h-3 w-3 mr-1" />
            A Confirmar ({groupedConsultations.aconfirmar.length})
          </Button>
          <Button variant={statusFilter === 'realizadas' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('realizadas')} className="h-8">
            <CheckCircle className="h-3 w-3 mr-1" />
            Realizadas ({groupedConsultations.realizadas.length})
          </Button>
          <Button variant={statusFilter === 'naocompareceu' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('naocompareceu')} className="h-8">
            <XCircle className="h-3 w-3 mr-1" />
            Não Compareceu ({groupedConsultations.naocompareceu.length})
          </Button>
        </div>
      </div>

      {/* Grupos de consultas */}
      <div className="space-y-6 w-full">
        {(statusFilter === 'todas' || statusFilter === 'proximas') && 
          renderGroupSection("Próximas Consultas", filteredGroups.proximas, <Clock className="h-4 w-4 text-blue-600" />, "Nenhuma consulta agendada")}

        {(statusFilter === 'todas' || statusFilter === 'aguardando') && 
          renderGroupSection("Aguardando Data", filteredGroups.aguardando, <CalendarClock className="h-4 w-4 text-amber-600" />, "Nenhuma consulta aguardando data")}

        {(statusFilter === 'todas' || statusFilter === 'aconfirmar') && 
          renderGroupSection("A Confirmar", filteredGroups.aconfirmar, <AlertCircle className="h-4 w-4 text-orange-600" />, "Nenhuma consulta para confirmar", true)}

        {(statusFilter === 'todas' || statusFilter === 'realizadas') && 
          renderGroupSection("Consultas Realizadas", filteredGroups.realizadas, <CheckCircle className="h-4 w-4 text-green-600" />, "Nenhuma consulta realizada")}

        {(statusFilter === 'todas' || statusFilter === 'naocompareceu') && 
          renderGroupSection("Não Compareceu", filteredGroups.naocompareceu, <XCircle className="h-4 w-4 text-red-600" />, "Nenhuma consulta marcada como não compareceu")}
      </div>

      <CreateConsultationModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />

      <RecordingModal isOpen={recordingModalOpen} onClose={() => {
      setRecordingModalOpen(false);
      setSelectedConsultationId(null);
    }} consultationId={selectedConsultationId} />
    </div>;
};