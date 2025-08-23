import { useState } from "react";
import { AgendaTimeline } from "@/components/AgendaTimeline";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface AgendaEvent {
  id: number;
  tipo: "consulta" | "exame" | "vacina" | "outro";
  data: string;
  hora: string;
  medico?: string;
  observacoes?: string;
  criadoEm: string;
}

const Agenda = () => {
  const [eventos, setEventos] = useState<AgendaEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();

  const handleAddEvent = (evento: Omit<AgendaEvent, "id" | "criadoEm">) => {
    const novoEvento: AgendaEvent = {
      ...evento,
      id: Date.now(),
      criadoEm: new Date().toISOString()
    };
    
    setEventos(prev => [...prev, novoEvento]);
    setShowAddModal(false);
    
    toast({
      title: "Evento adicionado",
      description: "Seu compromisso foi adicionado à agenda com sucesso.",
    });
  };

  const handleDeleteEvent = (eventId: number) => {
    setEventos(prev => prev.filter(evento => evento.id !== eventId));
    
    toast({
      title: "Evento removido",
      description: "O compromisso foi removido da sua agenda.",
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div /> {/* Spacer since title is in AppLayout */}
        
        <Button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Evento
        </Button>
      </div>

      {/* Timeline de Eventos */}
      <AgendaTimeline 
        eventos={eventos}
        onDeleteEvent={handleDeleteEvent}
        showAddModal={showAddModal}
        onCloseModal={() => setShowAddModal(false)}
        onAddEvent={handleAddEvent}
      />
    </>
  );
};

export default Agenda;