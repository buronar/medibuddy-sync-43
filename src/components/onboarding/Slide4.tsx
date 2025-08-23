import { motion } from "framer-motion";
import { Camera, FileText, Search } from "lucide-react";

const Slide4 = () => {
  return (
    <div className="h-full w-full flex flex-col justify-between p-4">
      <div className="max-w-md mx-auto h-full flex flex-col justify-between">
        
        {/* Bloco superior - Título + Subtítulo */}
        <div className="text-center pt-8">
          <h1 className="font-bold text-gray-900 mb-3 leading-tight text-[22px]">
            Digitalize seus exames e receitas
          </h1>
          
          <p className="text-base text-slate-600 font-normal">
            Fotografe ou importe documentos e tenha tudo acessível em um só lugar.
          </p>
        </div>
        
        {/* Imagem central */}
        <div className="flex items-center justify-center">
          <div className="relative w-72 h-64 mx-auto">
            {/* Ícones de documentos de fundo */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.15, 0.1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            >
              <FileText className="w-32 h-32 text-primary/20" />
            </motion.div>
            
            {/* Smartphone central com documento */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-48 bg-white rounded-2xl border-4 border-primary shadow-2xl">
              <div className="w-full h-8 bg-primary rounded-t-xl flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="p-3 space-y-3">
                {/* Header da tela */}
                <div className="w-4/5 h-1.5 bg-primary/20 rounded mx-auto"></div>
                
                {/* Documento/Foto simulada */}
                <div className="relative h-20 bg-primary/5 rounded border border-primary/20 p-2">
                  {/* Simulação de texto do documento */}
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-primary/20 rounded"></div>
                    <div className="w-4/5 h-1 bg-primary/15 rounded"></div>
                    <div className="w-3/4 h-1 bg-primary/15 rounded"></div>
                    <div className="w-full h-1 bg-primary/20 rounded"></div>
                    <div className="w-2/3 h-1 bg-primary/15 rounded"></div>
                  </div>
                  
                  {/* Overlay de ícone de câmera */}
                  <motion.div 
                    className="absolute top-1 right-1 w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center"
                    animate={{
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    <Camera className="w-2 h-2 text-primary" />
                  </motion.div>
                </div>
                
                {/* Botões de ação */}
                <div className="flex items-center justify-center gap-2">
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Camera className="w-3 h-3 text-primary/60" />
                  </motion.div>
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Search className="w-3 h-3 text-primary/60" />
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Ícones flutuantes de documentos */}
            <motion.div 
              className="absolute top-8 left-4 w-8 h-8"
              animate={{
                y: [-5, 5, -5],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5
              }}
            >
              <FileText className="w-full h-full text-primary/30" />
            </motion.div>
            
            <motion.div 
              className="absolute top-12 right-6 w-6 h-6"
              animate={{
                y: [5, -5, 5],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 1
              }}
            >
              <Camera className="w-full h-full text-primary/30" />
            </motion.div>
            
            <motion.div 
              className="absolute bottom-8 left-8 w-6 h-6"
              animate={{
                rotate: [0, 10, -10, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            >
              <Search className="w-full h-full text-primary/30" />
            </motion.div>
          </div>
        </div>
        
        {/* Texto extra (tip) abaixo da imagem */}
        <div className="text-center pb-8">
          <p className="text-sm text-gray-500">
            Tudo criptografado e disponível quando você precisar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Slide4;