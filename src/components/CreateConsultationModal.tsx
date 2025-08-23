import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useConsultations } from "@/contexts/ConsultationsContext";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const especialidades = [
  "Clínica Geral",
  "Cardiologia",
  "Dermatologia",
  "Endocrinologia",
  "Gastroenterologia",
  "Geriatria",
  "Ginecologia",
  "Hematologia",
  "Infectologia",
  "Medicina do Trabalho",
  "Nefrologia",
  "Neurologia",
  "Nutrologia",
  "Oftalmologia",
  "Oncologia",
  "Ortopedia",
  "Otorrinolaringologia",
  "Pediatria",
  "Psiquiatria",
  "Urologia"
];

// Generate hour options (00-23)
const generateHourOptions = () => {
  const hours = [];
  for (let hour = 0; hour < 24; hour++) {
    hours.push(hour.toString().padStart(2, '0'));
  }
  return hours;
};

// Generate minute options in 5-minute intervals
const generateMinuteOptions = () => {
  const minutes = [];
  for (let minute = 0; minute < 60; minute += 5) {
    minutes.push(minute.toString().padStart(2, '0'));
  }
  return minutes;
};

export const CreateConsultationModal = ({ isOpen, onClose }: CreateConsultationModalProps) => {
  const { addConsultation } = useConsultations();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedHour, setSelectedHour] = useState<string>("");
  const [selectedMinute, setSelectedMinute] = useState<string>("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [formData, setFormData] = useState({
    doctor: "",
    specialty: "",
    address: "",
    notes: "",
    // Novos campos para mais opções
    appointmentType: "presential", // presential | telemedicine
    paymentType: "insurance", // insurance | private
    guideNumber: "",
    mainReason: "",
    document: null as File | null,
    reminderEnabled: false,
    reminderTime: "1day" // 1day | 1hour
  });

  const hourOptions = generateHourOptions();
  const minuteOptions = generateMinuteOptions();

  // Verifica se a data é passada
  const isDateInPast = selectedDate ? selectedDate < new Date(new Date().setHours(0, 0, 0, 0)) : false;
  
  // Verifica se os campos obrigatórios estão preenchidos
  const isFormValid = () => {
    if (!formData.specialty || !selectedDate || !selectedHour || !selectedMinute) {
      return false;
    }
    // Para presencial, endereço é obrigatório
    if (formData.appointmentType === "presential" && !formData.address) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação específica para telemedicina
    if (formData.appointmentType === "telemedicine") {
      // Para telemedicina, o local não é obrigatório
      if (!formData.specialty || !selectedDate || !selectedHour || !selectedMinute) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha especialidade, data, hora e minuto.",
          variant: "destructive"
        });
        return;
      }
    } else {
      // Para consulta presencial, local é obrigatório
      if (!formData.specialty || !selectedDate || !selectedHour || !selectedMinute || !formData.address) {
        toast({
          title: "Campos obrigatórios", 
          description: "Preencha especialidade, data, hora, minuto e endereço.",
          variant: "destructive"
        });
        return;
      }
    }

    // Combine date and time
    const hours = parseInt(selectedHour);
    const minutes = parseInt(selectedMinute);
    const consultationDate = new Date(selectedDate);
    consultationDate.setHours(hours, minutes, 0, 0);

    const newConsultation = {
      id: Date.now().toString(),
      doctor: formData.doctor || undefined,
      specialty: formData.specialty,
      date: consultationDate,
      address: formData.appointmentType === "telemedicine" ? undefined : formData.address,
      notes: formData.notes || undefined,
      status: isDateInPast ? 'Realizada' as const : 'Agendada' as const,
      appointmentType: formData.appointmentType as 'presential' | 'telemedicine'
    };

    addConsultation(newConsultation);
    
    toast({
      title: "Consulta criada",
      description: `Consulta de ${formData.specialty} agendada com sucesso.`,
    });

    setFormData({ 
      doctor: "", 
      specialty: "", 
      address: "", 
      notes: "",
      appointmentType: "presential",
      paymentType: "insurance", 
      guideNumber: "",
      mainReason: "",
      document: null,
      reminderEnabled: false,
      reminderTime: "1day"
    });
    setSelectedDate(undefined);
    setSelectedHour("");
    setSelectedMinute("");
    setShowMoreOptions(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md rounded-2xl bg-background shadow-lg flex flex-col h-[90dvh] max-h-[680px] p-0">
        {/* Header sticky */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle>Criar Nova Consulta</DialogTitle>
          </DialogHeader>
        </div>
        
        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidade médica *</Label>
              <Select value={formData.specialty} onValueChange={(value) => handleInputChange("specialty", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((especialidade) => (
                    <SelectItem key={especialidade} value={especialidade}>
                      {especialidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data *</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setIsDatePickerOpen(false);
                    }}
                    disabled={false} // Permitir datas retroativas
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hour">Hora *</Label>
                <Select value={selectedHour} onValueChange={setSelectedHour}>
                  <SelectTrigger>
                    <SelectValue placeholder="00" />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minute">Minuto *</Label>
                <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                  <SelectTrigger>
                    <SelectValue placeholder="00" />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Campo Local/Endereço - apenas se não for telemedicina */}
            {formData.appointmentType !== "telemedicine" && (
              <div className="space-y-2">
                <Label htmlFor="address">Local / Endereço *</Label>
                {/* TODO: Integrar Google Maps Autocomplete */}
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Ex: Rua das Flores, 123 - Centro"
                  required={formData.appointmentType === "presential"}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="doctor">Nome do médico (opcional)</Label>
              <Input
                id="doctor"
                value={formData.doctor}
                onChange={(e) => handleInputChange("doctor", e.target.value)}
                placeholder="Dr. João Silva"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Informações adicionais sobre a consulta"
                rows={3}
              />
            </div>

            {/* Botão Mais Opções */}
            <Collapsible open={showMoreOptions} onOpenChange={setShowMoreOptions}>
              <CollapsibleTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full justify-between p-2 h-auto"
                >
                  <span className="text-sm font-medium">Mais Opções</span>
                  {showMoreOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-4 pt-2">
                {/* Tipo de Atendimento */}
                <div className="space-y-3">
                  <Label>Tipo de Atendimento</Label>
                  <RadioGroup 
                    value={formData.appointmentType} 
                    onValueChange={(value) => handleInputChange("appointmentType", value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="presential" id="presential" />
                      <Label htmlFor="presential" className="text-sm font-normal cursor-pointer">Presencial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="telemedicine" id="telemedicine" />
                      <Label htmlFor="telemedicine" className="text-sm font-normal cursor-pointer">Telemedicina</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Convênio / Particular */}
                <div className="space-y-3">
                  <Label>Forma de Pagamento</Label>
                  <RadioGroup 
                    value={formData.paymentType} 
                    onValueChange={(value) => handleInputChange("paymentType", value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="insurance" id="insurance" />
                      <Label htmlFor="insurance" className="text-sm font-normal cursor-pointer">Convênio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private" className="text-sm font-normal cursor-pointer">Particular</Label>
                    </div>
                  </RadioGroup>

                  {/* Número da Guia - só aparece se for convênio */}
                  {formData.paymentType === "insurance" && (
                    <div className="space-y-2">
                      <Label htmlFor="guideNumber">Número da Guia (opcional)</Label>
                      <Input
                        id="guideNumber"
                        value={formData.guideNumber}
                        onChange={(e) => handleInputChange("guideNumber", e.target.value)}
                        placeholder="Ex: 123456789"
                      />
                    </div>
                  )}
                </div>

                {/* Motivo Principal */}
                <div className="space-y-2">
                  <Label htmlFor="mainReason">Motivo Principal ou Sintomas</Label>
                  <Textarea
                    id="mainReason"
                    value={formData.mainReason}
                    onChange={(e) => handleInputChange("mainReason", e.target.value)}
                    placeholder="Ex: Dor de cabeça, check-up, acompanhamento..."
                    rows={2}
                  />
                </div>

                {/* Upload de Documento */}
                <div className="space-y-2">
                  <Label htmlFor="document">Documento Prévio (opcional)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData(prev => ({ ...prev, document: file }));
                      }}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("document")?.click()}
                      className="w-full justify-start"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {formData.document ? formData.document.name : "Selecionar arquivo"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formatos aceitos: PDF, JPG, PNG
                  </p>
                </div>

                {/* Lembrete - só se data for futura */}
                {!isDateInPast && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reminderEnabled"
                        checked={formData.reminderEnabled}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, reminderEnabled: !!checked }))
                        }
                      />
                      <Label htmlFor="reminderEnabled" className="text-sm font-normal cursor-pointer">
                        Ativar lembrete
                      </Label>
                    </div>

                    {formData.reminderEnabled && (
                      <Select 
                        value={formData.reminderTime} 
                        onValueChange={(value) => handleInputChange("reminderTime", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Quando lembrar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1day">1 dia antes</SelectItem>
                          <SelectItem value="3hours">3 horas antes</SelectItem>
                          <SelectItem value="1hour">1 hora antes</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Footer sticky */}
        <form onSubmit={handleSubmit}>
          <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur border-t px-6 py-4">
            <Button type="submit" className="w-full" disabled={!isFormValid()}>
              Criar Consulta
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="w-full mt-2">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};