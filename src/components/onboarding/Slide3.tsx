import { motion } from "framer-motion";
import { Mic, Play, SkipBack, SkipForward } from "lucide-react";

const Slide3 = () => {
  return (
    <div className="h-full w-full flex flex-col justify-between p-4">
      <div className="max-w-md mx-auto h-full flex flex-col justify-between">
        
        {/* Bloco superior - Título + Subtítulo */}
        <div className="text-center pt-8">
          <h1 className="font-bold text-gray-900 mb-3 leading-tight text-[22px]">
            Grave e revisite cada detalhe
          </h1>
          
          <p className="text-base text-slate-600 font-normal">
            Inicie a gravação no consultório, com consentimento do médico, e acesse o áudio quando precisar.
          </p>
        </div>
        
        {/* Imagem central */}
        <div className="flex items-center justify-center">
          <div className="relative w-72 h-64 mx-auto">
            {/* Ondas sonoras de fundo */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              <Mic className="w-32 h-32 text-primary/20" />
            </motion.div>
            
            {/* Smartphone central com player */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-48 bg-white rounded-2xl border-4 border-primary shadow-2xl">
              <div className="w-full h-8 bg-primary rounded-t-xl flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="p-3 space-y-3">
                {/* Título do player */}
                <div className="w-4/5 h-1.5 bg-primary/20 rounded mx-auto"></div>
                
                {/* Forma de onda */}
                <div className="flex items-end justify-center gap-0.5 h-12 bg-primary/5 rounded p-2">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary/30 rounded-full"
                      style={{
                        height: `${Math.random() * 20 + 10}px`
                      }}
                      animate={{
                        scaleY: [1, 1.5, 1],
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
                
                {/* Controles do player */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <SkipBack className="w-3 h-3 text-primary/60" />
                  </div>
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    <Play className="w-4 h-4 text-primary fill-current" />
                  </motion.div>
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <SkipForward className="w-3 h-3 text-primary/60" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ondas sonoras animadas ao redor */}
            <motion.div 
              className="absolute top-1/2 left-8 w-8 h-8"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.5
              }}
            >
              <div className="w-full h-full border-2 border-primary/30 rounded-full"></div>
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 right-8 w-8 h-8"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 1
              }}
            >
              <div className="w-full h-full border-2 border-primary/30 rounded-full"></div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              <div className="w-full h-full border-2 border-primary/20 rounded-full"></div>
            </motion.div>
          </div>
        </div>
        
        {/* Texto extra (tip) abaixo da imagem */}
        <div className="text-center pb-8">
          <p className="text-sm text-gray-500">
            Seus dados são criptografados e protegidos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Slide3;