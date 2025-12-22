import { useState } from "react";
import { trpc } from "../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";

export default function Services() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(60); // Par défaut 60 min
  
  const queryClient = useQueryClient();
  const { data: services, isLoading } = trpc.service.list.useQuery();
  
  const createService = trpc.service.create.useMutation({
    onSuccess: () => {
      // 1. Rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: [["service", "list"]] });
      // 2. Vider le formulaire
      setName("");
      setPrice(0);
      setDuration(60);
      // 3. Confirmation visuelle
      alert("✅ Service ajouté avec succès !");
    },
    onError: (error) => {
      // 4. Afficher l'erreur si ça plante
      alert("❌ Erreur : " + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (price <= 0) {
        alert("Le prix doit être supérieur à 0");
        return;
    }
    // On envoie les 3 infos obligatoires
    createService.mutate({ name, price, duration });
  };

  if (isLoading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Mes Services</h1>

      {/* Formulaire d'ajout */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Ajouter un nouveau service</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          
          {/* Nom du service */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-1 text-gray-700">Nom du service</label>
            <input 
              value={name} onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Ex: Massothérapie"
              required
            />
          </div>

          {/* Prix en DOLLARS */}
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium mb-1 text-gray-700">Prix ($ CAD)</label>
            <input 
              type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 outline-none" 
              required
              min="0"
            />
          </div>

           {/* Durée (Nouveau champ obligatoire) */}
           <div className="w-full md:w-32">
            <label className="block text-sm font-medium mb-1 text-gray-700">Durée (min)</label>
            <input 
              type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 outline-none" 
              required
              min="1"
            />
          </div>

          {/* Bouton d'action */}
          <button 
            type="submit" 
            disabled={createService.isPending} 
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors w-full md:w-auto"
          >
            {createService.isPending ? "Ajout..." : "Ajouter"}
          </button>
        </form>
      </div>

      {/* Liste des services existants */}
      <div className="grid gap-4">
        {services?.map((s) => (
          <div key={s.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
                <span className="font-bold text-lg text-gray-800 block">{s.name}</span>
                <span className="text-sm text-gray-500">{s.duration} minutes</span>
            </div>
            <span className="text-blue-700 bg-blue-50 px-4 py-2 rounded-lg font-bold border border-blue-100">
              {s.price} $
            </span>
          </div>
        ))}
        {services?.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
             <p className="text-gray-500">Vous n'avez pas encore de services.</p>
          </div>
        )}
      </div>
    </div>
  );
}
