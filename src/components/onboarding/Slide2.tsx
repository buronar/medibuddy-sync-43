import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
const Slide2 = () => {
  return <div className="h-full w-full flex flex-col justify-between p-4">
      <div className="max-w-md mx-auto h-full flex flex-col justify-between">
        
        {/* Bloco superior - Título + Subtítulo */}
        <div className="text-center pt-8">
          <h1 className="font-bold text-gray-900 mb-3 leading-tight text-[22px]">
            Agende e organize suas consultas em segundos
          </h1>
          
          <p className="text-base text-slate-600 font-normal">
            Escolha a especialidade, data, horário e local. Adicione notas importantes para não esquecer nada.
          </p>
        </div>
        
        {/* Imagem central */}
        <div className="flex items-center justify-center">
          <div className="relative w-72 h-64 mx-auto">
            {/* Mockup do formulário de consulta */}
            <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 mx-0 px-[28px] my-0 py-[8px]">
              {/* Header do formulário */}
              <div className="text-center mb-4">
                <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-3"></div>
                <div className="w-3/4 h-2 bg-gray-200 rounded mx-auto"></div>
              </div>
              
              {/* Campo Especialidade */}
              <div className="mb-3">
                <div className="w-16 h-1.5 bg-gray-300 rounded mb-1"></div>
                <motion.div className="w-full h-8 bg-primary/10 rounded-lg border border-primary/20 flex items-center px-3" animate={{
                borderColor: ["hsl(var(--primary) / 0.2)", "hsl(var(--primary) / 0.4)", "hsl(var(--primary) / 0.2)"]
              }} transition={{
                duration: 2,
                repeat: Infinity
              }}>
                  <div className="w-2/3 h-1.5 bg-primary/30 rounded"></div>
                  <div className="ml-auto w-3 h-3 border-l border-b border-primary/40 transform rotate-45"></div>
                </motion.div>
              </div>
              
              {/* Campos Data e Hora */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <div className="w-8 h-1.5 bg-gray-300 rounded mb-1"></div>
                  <div className="w-full h-8 bg-gray-50 rounded-lg border border-gray-200 flex items-center px-2">
                    <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                    <div className="w-2/3 h-1.5 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="w-8 h-1.5 bg-gray-300 rounded mb-1"></div>
                  <div className="w-full h-8 bg-gray-50 rounded-lg border border-gray-200 flex items-center px-2">
                    <div className="w-2/3 h-1.5 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Campo Local */}
              <div className="mb-3">
                <div className="w-10 h-1.5 bg-gray-300 rounded mb-1"></div>
                <div className="w-full h-8 bg-gray-50 rounded-lg border border-gray-200 flex items-center px-2">
                  <div className="w-4/5 h-1.5 bg-gray-300 rounded"></div>
                </div>
              </div>
              
              {/* Campo Observações */}
              <div className="mb-4">
                <div className="w-16 h-1.5 bg-gray-300 rounded mb-1"></div>
                <div className="w-full h-12 bg-gray-50 rounded-lg border border-gray-200 p-2">
                  <div className="w-full h-1.5 bg-gray-300 rounded mb-1"></div>
                  <div className="w-3/4 h-1.5 bg-gray-300 rounded"></div>
                </div>
              </div>
              
              {/* Botão de ação simulado */}
              <motion.div className="w-full h-8 bg-primary rounded-lg flex items-center justify-center" animate={{
              scale: [1, 1.02, 1]
            }} transition={{
              duration: 2,
              repeat: Infinity
            }}>
                <div className="w-16 h-1.5 bg-white/80 rounded"></div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Texto extra (tip) abaixo da imagem */}
        <div className="text-center pb-8">
          <p className="text-sm text-gray-500">
            Leva menos de 30 segundos para cadastrar.
          </p>
        </div>
      </div>
    </div>;
};
export default Slide2;