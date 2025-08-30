import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { isOnboardingEnabled } from "@/config/features";
import { OnboardingGuard } from "@/components/guards/OnboardingGuard";
import { RecordingsProvider } from "@/contexts/RecordingsContext";
import { ConsultationsProvider } from "@/contexts/ConsultationsContext";
import { FilesProvider } from "@/contexts/FilesContext";
import { MedicationsProvider } from "@/contexts/MedicationsContext";
import { ReminderService } from "@/components/ReminderService";
import { AppLayout } from "@/components/AppLayout";
import { PageTransition } from "@/components/PageTransition";
import OnboardingRedirect from "@/components/OnboardingRedirect";
import OnboardingCarousel from "@/components/OnboardingCarousel";
import Dashboard from "./pages/Dashboard";
import Consultas from "./pages/Consultas";
import ConsultationDetails from "./pages/ConsultationDetails";
import Arquivos from "./pages/Arquivos";
import Agenda from "./pages/Agenda";
import Assistente from "./pages/Assistente";
import Medicamentos from "./pages/Medicamentos";
import Perfil from "./pages/Perfil";
import Lembretes from "./pages/Lembretes";
import { Mais } from "./pages/Mais";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para ativar o sistema de lembretes em background
// const ReminderService = () => {
//   useReminders();
//   return null;
// };

const getPageInfo = (pathname: string) => {
  switch (pathname) {
    case "/":
    case "/dashboard":
      return {
        title: "Olá! Bem-vindo ao SaúdeSync",
        subtitle: "Organize e acompanhe sua saúde de forma simples e eficiente"
      };
    case "/onboarding":
      return {
        title: "Bem-vindo",
        subtitle: "Conheça o SaúdeSync"
      };
    case "/consultas":
      return {
        title: "Minhas Consultas",
        subtitle: "Organize e acompanhe suas consultas médicas"
      };
    case "/arquivos":
      return {
        title: "Meus Arquivos",
        subtitle: "Gerencie seus documentos, exames e receitas médicas"
      };
    case "/agenda":
      return {
        title: "Minha Agenda",
        subtitle: "Organize seus compromissos e lembretes médicos"
      };
    case "/assistente":
      return {
        title: "IA Assistente",
        subtitle: "Sua assistente pessoal para dúvidas sobre saúde"
      };
    case "/perfil":
      return {
        title: "Meu Perfil",
        subtitle: "Gerencie suas informações pessoais e preferências"
      };
    case "/lembretes":
      return {
        title: "Meus Lembretes",
        subtitle: "Acompanhe todos os seus lembretes de consultas"
      };
    case "/mais":
      return {
        title: "Mais Opções",
        subtitle: "Configurações, ajuda e outras funcionalidades"
      };
    case "/login":
      return {
        title: "Login",
        subtitle: "Entre na sua conta"
      };
    case "/medicamentos":
      return {
        title: "Meus Medicamentos",
        subtitle: "Gerencie seus medicamentos e receitas médicas"
      };
    default:
      return {
        title: "Página não encontrada",
        subtitle: "A página que você procura não existe"
      };
  }
};

const AppContent = () => {
  const location = useLocation();
  const { title, subtitle } = getPageInfo(location.pathname);

  // Para páginas sem layout (login e onboarding)
  if (location.pathname === '/login' || location.pathname === '/onboarding') {
    return (
      <PageTransition location={location.pathname}>
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={
            <OnboardingGuard>
              <OnboardingCarousel />
            </OnboardingGuard>
          } />
        </Routes>
      </PageTransition>
    );
  }

  return (
    <OnboardingRedirect>
      <ReminderService />
      <AppLayout title={title} subtitle={subtitle}>
        <PageTransition location={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/consultas/:id" element={<ConsultationDetails />} />
            <Route path="/medicamentos" element={<Medicamentos />} />
            <Route path="/arquivos" element={<Arquivos />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/assistente" element={<Assistente />} />
            <Route path="/assistente/:id" element={<Assistente />} />
            <Route path="/lembretes" element={<Lembretes />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/mais" element={<Mais />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </AppLayout>
    </OnboardingRedirect>
  );
};

const App = () => {
  console.log('SaúdeSync App loading... All imports resolved! 🎉'); // Debug log to force rebuild
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <RecordingsProvider>
            <ConsultationsProvider>
              <FilesProvider>
                <MedicationsProvider>
                  <BrowserRouter>
                    <AppContent />
                  </BrowserRouter>
                </MedicationsProvider>
              </FilesProvider>
            </ConsultationsProvider>
          </RecordingsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
