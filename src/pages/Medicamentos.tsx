import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddMedicationModal } from "@/components/AddMedicationModal";
import { useMedications } from "@/contexts/MedicationsContext";
import { Plus, Pill, Trash2, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Medicamentos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { medications, deleteMedication } = useMedications();
  const { toast } = useToast();

  const handleDeleteMedication = (id: string, name: string) => {
    deleteMedication(id);
    toast({
      title: "Medicamento removido",
      description: `${name} foi removido da sua lista.`,
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <AppLayout 
      title="Meus Medicamentos" 
      subtitle="Gerencie seus medicamentos e receitas médicas"
    >
      <div className="space-y-6">
        {/* Add Medication Button */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {medications.length} medicamento{medications.length !== 1 ? 's' : ''} registrado{medications.length !== 1 ? 's' : ''}
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Medicamento
          </Button>
        </div>

        {/* Medications List */}
        {medications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Pill className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Nenhum medicamento registrado</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione seus medicamentos para acompanhar o tratamento
                </p>
              </div>
              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Primeiro Medicamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {medications.map((medication) => (
              <Card key={medication.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Pill className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium">
                          {medication.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {medication.dosage || "Dosagem não informada"}
                          </Badge>
                          {medication.frequency && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {medication.frequency}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover medicamento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover "{medication.name}" da sua lista de medicamentos?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteMedication(medication.id, medication.name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                
                {(medication.notes || medication.imageUrl) && (
                  <CardContent className="pt-0">
                    {medication.imageUrl && (
                      <div className="mb-3">
                        <img
                          src={medication.imageUrl}
                          alt="Receita médica"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    
                    {medication.notes && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium mb-1">Observações</div>
                            <div className="text-sm text-muted-foreground">
                              {medication.notes}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground mt-3">
                      Adicionado em {formatDate(medication.createdAt)}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddMedicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </AppLayout>
  );
};

export default Medicamentos;