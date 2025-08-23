import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Slide5 = () => {
  return (
    <div className="h-full w-full flex flex-col justify-between p-4">
      <div className="max-w-md mx-auto h-full flex flex-col justify-between">
        
        {/* Bloco superior - Título + Subtítulo */}
        <div className="text-center pt-8">
          <h1 className="font-bold text-gray-900 mb-3 leading-tight text-[22px]">
            Comece agora sua jornada com o SaúdeSync
          </h1>
          
          <p className="text-base text-slate-600 font-normal">
            Agende sua primeira consulta ou grave seu atendimento em um toque.
          </p>
        </div>
        
        {/* Imagem central */}
        <div className="flex items-center justify-center">
          <div className="relative w-72 h-64 mx-auto">
            {/* Ícones de fundo com efeito de brilho */}
            <motion.div 
              className="absolute top-4 left-4 w-8 h-8"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sparkles className="w-full h-full text-primary/30" />
            </motion.div>
            
            <motion.div 
              className="absolute top-8 right-8 w-6 h-6"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1
              }}
            >
              <Heart className="w-full h-full text-primary/40" />
            </motion.div>
            
            {/* Smartphone central com CTA */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-48 bg-white rounded-2xl border-4 border-primary shadow-2xl">
              <div className="w-full h-8 bg-primary rounded-t-xl flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="p-3 space-y-4">
                {/* Logo/Header do app */}
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div className="w-3/4 h-1 bg-primary/20 rounded mx-auto"></div>
                </div>
                
                {/* Botão CTA Principal */}
                <motion.div 
                  className="w-full h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 4px 15px rgba(29, 155, 240, 0.3)",
                      "0 8px 25px rgba(29, 155, 240, 0.5)",
                      "0 4px 15px rgba(29, 155, 240, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <div className="w-16 h-1.5 bg-white/90 rounded mr-1"></div>
                  <ArrowRight className="w-2 h-2 text-white" />
                </motion.div>
                
                {/* Botões secundários */}
                <div className="space-y-2">
                  <div className="w-full h-6 bg-primary/10 rounded border border-primary/20 flex items-center justify-center">
                    <div className="w-12 h-1 bg-primary/40 rounded"></div>
                  </div>
                  <div className="w-full h-6 bg-primary/10 rounded border border-primary/20 flex items-center justify-center">
                    <div className="w-10 h-1 bg-primary/40 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Efeitos decorativos flutuantes */}
            <motion.div 
              className="absolute bottom-4 left-12 w-4 h-4"
              animate={{
                y: [-10, 10, -10],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 0.5
              }}
            >
              <div className="w-full h-full bg-primary/20 rounded-full"></div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-8 right-4 w-6 h-6"
              animate={{
                y: [10, -10, 10],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 1.5
              }}
            >
              <div className="w-full h-full bg-primary/25 rounded-full"></div>
            </motion.div>
            
            {/* Anel de destaque ao redor do smartphone */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-56 border-2 border-primary/20 rounded-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            />
          </div>
        </div>
        
        {/* Texto extra (tip) abaixo da imagem */}
        <div className="text-center pb-8">
          <p className="text-sm text-gray-500 mb-6">
            Personalize sua experiência conforme suas necessidades.
          </p>
          
          <Button asChild className="w-full mt-6">
            <Link
              to="/dashboard"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Ir para a Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Slide5;