import { trpc } from "../utils/trpc";

export default function Dashboard() {
  const { data: authData } = trpc.auth.me.useQuery();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-lg text-gray-700">
          Bonjour <strong>{authData?.user?.name}</strong>, bienvenue dans votre espace de gestion.
        </p>
        <p className="text-gray-500 mt-2">
          Utilisez le menu de gauche pour gérer vos services et vos réservations.
        </p>
      </div>
    </div>
  );
}
// Fix v2
