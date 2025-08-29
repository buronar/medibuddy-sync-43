import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, FileText, Pill, Calendar, AlertCircle } from "lucide-react";

interface AIAnalysisSectionProps {
  consultationId: string;
}

export const AIAnalysisSection = ({ consultationId }: AIAnalysisSectionProps) => {
  const placeholderCards = [
    {
      icon: FileText,
      title: "Resumo da Consulta",
      description: "Principais tópicos discutidos",
      status: "Em breve"
    },
    {
      icon: Pill,
      title: "Medicamentos Prescritos", 
      description: "Análise de receitas e orientações",
      status: "Em breve"
    },
    {
      icon: Calendar,
      title: "Próximos Passos",
      description: "Retornos e exames recomendados",
      status: "Em breve"
    },
    {
      icon: AlertCircle,
      title: "Sintomas Reportados",
      description: "Acompanhamento de evolução",
      status: "Em breve"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Análise Inteligente da Consulta
            <Sparkles className="h-4 w-4 text-amber-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">
                  Análise com IA disponível em breve
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Em futuras versões, nossa IA analisará automaticamente suas consultas, 
                  gravações e documentos para gerar insights personalizados.
                </p>
                <Button size="sm" variant="outline" disabled>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Analisar Consulta
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {placeholderCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-3 border rounded-lg bg-secondary/20 opacity-60"
                >
                  <div className="flex items-start gap-2">
                    <IconComponent className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-muted-foreground">
                        {card.title}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {card.description}
                      </p>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {card.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              💡 A análise por IA incluirá: resumos automáticos, detecção de medicamentos, 
              acompanhamento de sintomas e sugestões de perguntas para próximas consultas.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};