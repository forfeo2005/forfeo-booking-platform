import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "./utils/trpc";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: authData, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
  });

  // Si l'utilisateur est connecté, on le redirige vers le tableau de bord
  useEffect(() => {
    if (authData?.user) {
      setLocation("/dashboard");
    }
  }, [authData, setLocation]);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-6 max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">Bienvenue sur Forfeo</h1>
        <p className="text-gray-600">La plateforme de réservation simplifiée.</p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setLocation("/login")}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Se connecter
          </button>
          <button 
            onClick={() => setLocation("/signup")}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
}

// Force git update v1
