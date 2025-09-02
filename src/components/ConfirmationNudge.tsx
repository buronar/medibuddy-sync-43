import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, CheckCircle, X } from "lucide-react";
import { useConsultations, type Consultation } from "@/contexts/ConsultationsContext";
import { useToast } from "@/hooks/use-toast";

interface ConfirmationNudgeProps {
  consultation: Consultation;
}

export const ConfirmationNudge = ({ consultation }: ConfirmationNudgeProps) => {
  const { updateConsultation } = useConsultations();
  const { toast } = useToast();

  const handleMarkAsCompleted = () => {
    updateConsultation(consultation.id, { status: 'Realizada' });
    toast({
      title: "Consulta confirmada",
      description: "A consulta foi marcada como realizada."
    });
  };

  const handleMarkAsNoShow = () => {
    updateConsultation(consultation.id, { status: 'Não Compareceu' });
    toast({
      title: "Consulta marcada",
      description: "A consulta foi marcada como não compareceu."
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-3"
    >
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
              <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="font-medium text-amber-900 dark:text-amber-200 mb-1">
                  Essa consulta aconteceu?
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Dr. {consultation.doctor} - {consultation.specialty}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  onClick={handleMarkAsCompleted}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar como Realizada
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleMarkAsNoShow}
                  className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4 mr-2" />
                  Não Compareci
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};