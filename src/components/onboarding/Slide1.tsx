import { motion } from "framer-motion";
import { Calendar, FileText, Pill } from "lucide-react";

const Slide1 = () => {
  return (
    <div className="h-full w-full flex flex-col justify-between p-4">
      <div className="max-w-md mx-auto h-full flex flex-col justify-between">
        
        {/* Bloco superior - Título + Subtítulo */}
        <div className="text-center pt-8">
          <h1 className="font-bold text-gray-900 mb-3 leading-tight text-[22px]">
            Tudo para sua saúde em um só lugar
          </h1>
          
          <p className="text-base text-slate-600 font-normal">
            Consultas, documentos e medicamentos, sempre à mão.
          </p>
        </div>
        
        {/* Imagem central */}
        <div className="flex items-center justify-center">
          <div className="relative w-72 h-64 mx-auto">
            {/* Smartphone central */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-44 bg-white rounded-2xl border-4 border-primary shadow-2xl">
              <div className="w-full h-8 bg-primary rounded-t-xl flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="p-4 space-y-2">
                <div className="w-full h-2 bg-primary/20 rounded"></div>
                <div className="w-4/5 h-2 bg-primary/20 rounded"></div>
                <div className="w-3/5 h-2 bg-primary/20 rounded"></div>
                <div className="w-full h-1.5 bg-primary/10 rounded mt-3"></div>
                <div className="w-3/4 h-1.5 bg-primary/10 rounded"></div>
              </div>
            </div>
            
            {/* Calendário - lado esquerdo */}
            <motion.div 
              className="absolute top-1/2 left-4 transform -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-xl" 
              animate={{
                y: [0, -6, 0],
                rotate: [0, 5, 0]
              }} 
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            >
              <Calendar className="w-6 h-6 text-white" />
            </motion.div>
            
            {/* Documento - lado direito */}
            <motion.div 
              className="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-xl" 
              animate={{
                y: [0, -6, 0],
                rotate: [0, -5, 0]
              }} 
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 1
              }}
            >
              <FileText className="w-6 h-6 text-white" />
            </motion.div>
            
            {/* Medicamento - base */}
            <motion.div 
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-xl rotate-12" 
              animate={{
                y: [0, -6, 0],
                rotate: [12, 18, 12]
              }} 
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 2
              }}
            >
              <Pill className="w-6 h-6 text-white" />
            </motion.div>
            
            {/* Linhas conectoras suaves */}
            <motion.div 
              className="absolute top-1/2 left-16 w-16 h-0.5 bg-gradient-to-r from-blue-300 to-transparent transform -translate-y-1/2" 
              animate={{
                opacity: [0.3, 0.8, 0.3]
              }} 
              transition={{
                duration: 3,
                repeat: Infinity
              }} 
            />
            <motion.div 
              className="absolute top-1/2 right-16 w-16 h-0.5 bg-gradient-to-l from-green-300 to-transparent transform -translate-y-1/2" 
              animate={{
                opacity: [0.3, 0.8, 0.3]
              }} 
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 1
              }} 
            />
            <motion.div 
              className="absolute bottom-14 left-1/2 w-0.5 h-12 bg-gradient-to-t from-orange-300 to-transparent transform -translate-x-1/2" 
              animate={{
                opacity: [0.3, 0.8, 0.3]
              }} 
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 2
              }} 
            />
          </div>
        </div>
        
        {/* Texto extra (tip) abaixo da imagem */}
        <div className="text-center pb-8">
          <p className="text-sm text-gray-500">
            Organize, acompanhe e nunca mais perca um detalhe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Slide1;