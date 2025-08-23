import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // TEMPORÁRIO: Redireciona automaticamente para dashboard
  useEffect(() => {
    toast({
      title: "Redirecionando...",
      description: "Sistema de login temporariamente desabilitado",
    });
    
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="flex justify-center">
              <img 
                src={logo} 
                alt="SaúdeSync Logo" 
                className="h-12 w-12 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                SaúdeSync
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Entre na sua conta para organizar sua vida médica
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary rounded-full animate-bounce"></div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Redirecionando...</h3>
                <p className="text-sm text-muted-foreground">
                  Sistema de login temporariamente desabilitado
                </p>
                <p className="text-xs text-muted-foreground">
                  Você será redirecionado automaticamente para o dashboard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;