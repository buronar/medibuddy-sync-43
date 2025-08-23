import { ConsultationsList } from "@/components/ConsultationsList";

const Consultas = () => {
  return (
    <div className="pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Consultas Médicas</h1>
          <p className="text-muted-foreground">
            Gerencie suas consultas e grave as orientações médicas
          </p>
        </div>
      </div>
      <ConsultationsList />
    </div>
  );
};

export default Consultas;