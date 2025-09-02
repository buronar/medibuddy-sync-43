import { ConsultationsList } from "@/components/ConsultationsList";

const Consultas = () => {
  return (
    <div className="pb-20">
      <div 
        className="mx-auto max-w-screen-sm px-4 md:px-6 space-y-6"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))'
        }}
      >
        <div className="pt-4">
          <h1 className="text-2xl font-bold mb-2">Consultas Médicas</h1>
          <p className="text-muted-foreground">
            Gerencie suas consultas e grave as orientações médicas
          </p>
        </div>
        <ConsultationsList />
      </div>
    </div>
  );
};

export default Consultas;