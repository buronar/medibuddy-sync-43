import { Calendar, FileText, Clock, History, Stethoscope, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const quickActions = [
  {
    icon: Stethoscope,
    label: "Nova Consulta",
    href: "/consultas"
  },
  {
    icon: FileText,
    label: "Adicionar Documento",
    href: "/arquivos"
  },
  {
    icon: Clock,
    label: "Meus Lembretes",
    href: "/agenda"
  },
  {
    icon: History,
    label: "Histórico Médico",
    href: "/assistente"
  },
  {
    icon: Pill,
    label: "Meus Medicamentos",
    href: "/medicamentos"
  },
  {
    icon: Calendar,
    label: "Consultas Agendadas",
    href: "/consultas"
  }
];

export const QuickActionButtons = () => {
  const navigate = useNavigate();

// Unified quick action styles: all cards use primary pastel blue

  return (
    <div className="mb-14">
      <div className="grid grid-cols-3 grid-rows-2 gap-3 md:gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              onClick={() => navigate(action.href)}
              aria-label={action.label}
              className={`
                cursor-pointer 
                rounded-lg p-3.5 md:p-4 
                aspect-square
                flex flex-col items-center justify-center gap-2
                select-none border shadow-sm
                bg-primary/10 border-primary/20
              `}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Icon className="h-8 w-8 mx-auto shrink-0 text-primary" strokeWidth={2} />
              {action.label === "Meus Medicamentos" ? (
                <div className="w-full flex justify-center">
                  <span className="font-inter font-medium text-xs md:text-sm text-foreground text-center leading-tight tracking-normal break-words whitespace-normal">
                    {action.label}
                  </span>
                </div>
              ) : (
                <span className="font-inter font-medium text-xs md:text-sm text-foreground mx-auto text-center leading-tight break-words whitespace-normal tracking-normal">
                  {action.label}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};