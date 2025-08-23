import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, FileText, Upload } from "lucide-react";
import { useMedications } from "@/contexts/MedicationsContext";
import { useToast } from "@/hooks/use-toast";

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMedicationModal = ({ isOpen, onClose }: AddMedicationModalProps) => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { addMedication } = useMedications();
  const { toast } = useToast();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Simulated OCR processing
      simulateOCRProcessing(file);
    }
  };

  const simulateOCRProcessing = async (file: File) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulated OCR results
    setName("Dipirona");
    setDosage("500mg");
    setFrequency("A cada 6 horas");
    setNotes("Tomar com água, após as refeições");
    
    setIsProcessing(false);
    toast({
      title: "Receita processada!",
      description: "Informações extraídas da imagem. Verifique e edite se necessário.",
    });
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome do medicamento.",
        variant: "destructive",
      });
      return;
    }

    const medication = {
      id: Date.now().toString(),
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      notes: notes.trim(),
      imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
      createdAt: new Date(),
    };

    addMedication(medication);
    
    toast({
      title: "Medicamento adicionado!",
      description: `${medication.name} foi registrado com sucesso.`,
    });

    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDosage("");
    setFrequency("");
    setNotes("");
    setSelectedImage(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Adicionar Medicamento
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Texto
            </TabsTrigger>
            <TabsTrigger value="photo" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Foto
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Medicamento *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dipirona"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Dosagem</Label>
              <Input
                id="dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="Ex: 500mg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequência</Label>
              <Input
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="Ex: A cada 6 horas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instruções especiais, efeitos colaterais, etc."
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="photo" className="space-y-4 mt-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
                id="photo-input"
              />
              <label
                htmlFor="photo-input"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Receita"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                ) : (
                  <Upload className="h-12 w-12 text-muted-foreground" />
                )}
                <div className="text-sm">
                  {selectedImage ? "Clique para alterar" : "Tirar foto da receita"}
                </div>
              </label>
            </div>

            {isProcessing && (
              <div className="text-center text-sm text-muted-foreground">
                <div className="animate-pulse">Processando receita...</div>
              </div>
            )}

            {selectedImage && !isProcessing && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name-photo">Nome do Medicamento *</Label>
                  <Input
                    id="name-photo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Dipirona"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage-photo">Dosagem</Label>
                  <Input
                    id="dosage-photo"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="Ex: 500mg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency-photo">Frequência</Label>
                  <Input
                    id="frequency-photo"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="Ex: A cada 6 horas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes-photo">Observações</Label>
                  <Textarea
                    id="notes-photo"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Instruções especiais, efeitos colaterais, etc."
                    rows={3}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1"
            disabled={!name.trim() || isProcessing}
          >
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};