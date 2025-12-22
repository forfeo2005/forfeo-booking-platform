import { useState } from "react";
import { trpc } from "../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";

export default function Services() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(60);
  
  const queryClient = useQueryClient();
  const { data: services, isLoading } = trpc.service.list.useQuery();
  
  const createService = trpc.service.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["service", "list"]] });
      setName("");
      setPrice(0);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createService.mutate({ name, price, duration });
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mes Services</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Ajouter un nouveau service</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input 
              value={name} onChange={(e) => setName(e.target.value)}
              className="border rounded p-2 w-full" 
              placeholder="Ex: Consultation" required
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">Prix (€)</label>
            <input 
              type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))}
              className="border rounded p-2 w-full" required
            />
          </div>
          <button 
            type="submit" disabled={createService.isPending} 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium h-[42px]"
          >
            {createService.isPending ? "..." : "Ajouter"}
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {services?.map((s) => (
          <div key={s.id} className="bg-white p-4 rounded shadow-sm border flex justify-between items-center">
            <span className="font-semibold">{s.name}</span>
            <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">{s.price} €</span>
          </div>
        ))}
      </div>
    </div>
  );
}
// Fix v2
