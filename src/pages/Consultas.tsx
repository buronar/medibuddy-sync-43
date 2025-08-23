import { ConsultationsList } from "@/components/ConsultationsList";

const Consultas = () => {
  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Consultas Médicas</h1>
        <p className="text-muted-foreground">
          Gerencie suas consultas e grave as orientações médicas
        </p>
      </div>
      <ConsultationsList />
    </div>
  );
};

export default Consultas;