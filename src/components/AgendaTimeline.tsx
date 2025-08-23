import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Stethoscope, TestTube, Syringe, FileText, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { AgendaEvent } from "@/pages/Agenda";

interface AgendaTimelineProps {
  eventos: AgendaEvent[];
  onDeleteEvent: (eventId: number) => void;
  showAddModal: boolean;
  onCloseModal: () => void;
  onAddEvent: (evento: Omit<AgendaEvent, "id" | "criadoEm">) => void;
}

interface EventFormData {
  tipo: "consulta" | "exame" | "vacina" | "outro";
  data: string;
  hora: string;
  medico: string;
  observacoes: string;
}

const getEventIcon = (tipo: string) => {
  switch (tipo) {
    case "consulta":
      return Stethoscope;
    case "exame":
      return TestTube;
    case "vacina":
      return Syringe;
    case "outro":
      return FileText;
    default:
      return Calendar;
  }
};

const getEventColor = (tipo: string) => {
  switch (tipo) {
    case "consulta":
      return "bg-primary";
    case "exame":
      return "bg-blue-500";
    case "vacina":
      return "bg-green-500";
    case "outro":
      return "bg-orange-500";
    default:
      return "bg-muted";
  }
};

const getEventTypeLabel = (tipo: string) => {
  switch (tipo) {
    case "consulta":
      return "Consulta";
    case "exame":
      return "Exame";
    case "vacina":
      return "Vacina";
    case "outro":
      return "Outro";
    default:
      return tipo;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hoje";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Amanhã";
  } else {
    return date.toLocaleDateString("pt-BR", { 
      weekday: "short", 
      day: "2-digit", 
      month: "short",
      year: "numeric"
    });
  }
};

const EmptyState = () => (
  <div className="text-center py-12">
    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
    <h3 className="font-inter font-semibold text-lg text-foreground mb-2">
      Nenhum compromisso agendado
    </h3>
    <p className="text-muted-foreground max-w-sm mx-auto">
      Seus próximos compromissos e lembretes médicos aparecerão aqui quando forem agendados.
    </p>
  </div>
);

const EventForm = ({ onSubmit, onCancel }: { 
  onSubmit: (data: EventFormData) => void; 
  onCancel: () => void;
}) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<EventFormData>({
    defaultValues: {
      tipo: "consulta",
      data: "",
      hora: "",
      medico: "",
      observacoes: ""
    }
  });

  const watchedTipo = watch("tipo");

  const onFormSubmit = (data: EventFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo do evento</Label>
        <Select
          value={watchedTipo}
          onValueChange={(value: "consulta" | "exame" | "vacina" | "outro") => 
            setValue("tipo", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consulta">Consulta</SelectItem>
            <SelectItem value="exame">Exame</SelectItem>
            <SelectItem value="vacina">Vacina</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            type="date"
            {...register("data", { required: "Data é obrigatória" })}
          />
          {errors.data && (
            <span className="text-sm text-destructive">{errors.data.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hora">Hora</Label>
          <Input
            id="hora"
            type="time"
            {...register("hora", { required: "Hora é obrigatória" })}
          />
          {errors.hora && (
            <span className="text-sm text-destructive">{errors.hora.message}</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="medico">Nome do médico (opcional)</Label>
        <Input
          id="medico"
          placeholder="Ex: Dr. João Silva"
          {...register("medico")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações (opcional)</Label>
        <Textarea
          id="observacoes"
          placeholder="Informações adicionais sobre o compromisso"
          rows={3}
          {...register("observacoes")}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Adicionar Evento
        </Button>
      </div>
    </form>
  );
};

export const AgendaTimeline = ({ 
  eventos, 
  onDeleteEvent, 
  showAddModal, 
  onCloseModal, 
  onAddEvent 
}: AgendaTimelineProps) => {
  // Ordenar eventos por data e hora (mais próximos primeiro)
  const eventosOrdenados = [...eventos].sort((a, b) => {
    const dateTimeA = new Date(`${a.data}T${a.hora}`).getTime();
    const dateTimeB = new Date(`${b.data}T${b.hora}`).getTime();
    return dateTimeA - dateTimeB;
  });

  const handleFormSubmit = (data: EventFormData) => {
    onAddEvent({
      tipo: data.tipo,
      data: data.data,
      hora: data.hora,
      medico: data.medico || undefined,
      observacoes: data.observacoes || undefined,
    });
  };

  if (eventosOrdenados.length === 0) {
    return (
      <>
        <EmptyState />
        
        <Dialog open={showAddModal} onOpenChange={onCloseModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Evento na Agenda</DialogTitle>
            </DialogHeader>
            <EventForm onSubmit={handleFormSubmit} onCancel={onCloseModal} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {eventosOrdenados.map((evento, index) => {
          const Icon = getEventIcon(evento.tipo);
          const isLast = index === eventosOrdenados.length - 1;

          return (
            <div key={evento.id} className="relative">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border" />
              )}
              
              {/* Timeline dot */}
              <div className="relative flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getEventColor(evento.tipo)}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>

                {/* Event card */}
                <Card className="flex-1 hover:bg-muted/30 transition-colors group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {getEventTypeLabel(evento.tipo)}
                          </Badge>
                        </div>

                        {evento.medico && (
                          <h3 className="font-inter font-semibold text-foreground text-sm mb-1">
                            {evento.medico}
                          </h3>
                        )}

                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(evento.data)}, {evento.hora}</span>
                        </div>

                        {evento.observacoes && (
                          <p className="text-sm text-muted-foreground">
                            {evento.observacoes}
                          </p>
                        )}
                      </div>

                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => onDeleteEvent(evento.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para adicionar evento */}
      <Dialog open={showAddModal} onOpenChange={onCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Evento na Agenda</DialogTitle>
          </DialogHeader>
          <EventForm onSubmit={handleFormSubmit} onCancel={onCloseModal} />
        </DialogContent>
      </Dialog>
    </>
  );
};