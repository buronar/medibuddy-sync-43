import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isOnboardingEnabled } from "@/config/features";

const OnboardingRedirect = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verifica se não estamos já no onboarding ou login
    if (location.pathname === '/onboarding' || location.pathname === '/login') {
      return;
    }

    // Verifica se o onboarding foi completado
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    
    if (isOnboardingEnabled()) {
      if (onboardingCompleted !== 'true') {
        // Primeiro acesso - redireciona para onboarding
        navigate('/onboarding', { replace: true });
      }
    } else {
      // Onboarding desabilitado - marca como completado para evitar redirecionamentos
      if (onboardingCompleted !== 'true') {
        localStorage.setItem('onboardingCompleted', 'true');
      }
    }
  }, [navigate, location.pathname]);

  return <>{children}</>;
};

export default OnboardingRedirect;