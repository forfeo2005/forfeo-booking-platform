import { trpc } from './utils/trpc';
import { useLocation } from 'wouter';

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: authData, isLoading } = trpc.auth.me.useQuery(undefined, {
     retry: false,
  });
  
  const logoutMutation = trpc.auth.logout.useMutation({
      onSuccess: () => {
          // Recharger ou rediriger login
          window.location.href = '/login';
      }
  });

  if (isLoading) return <div>Chargement...</div>;

  // Si pas connecté, afficher page d'accueil publique ou rediriger
  if (!authData || !authData.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur Forfeo Booking</h1>
        <p className="mb-8">Veuillez vous connecter pour accéder à votre espace.</p>
        <div className="space-x-4">
            <button 
                onClick={() => setLocation('/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
            >
                Connexion
            </button>
            <button 
                onClick={() => setLocation('/signup')}
                className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700"
            >
                Créer un compte
            </button>
        </div>
      </div>
    );
  }

  // Si connecté : Dashboard
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold">Bonjour, {authData.user.name}</h1>
            <p className="text-gray-600">
                Organisation: <strong>{authData.organizations.find(o => o.orgId === authData.activeOrgId)?.name}</strong>
            </p>
        </div>
        <button onClick={() => logoutMutation.mutate()} className="text-red-600 hover:underline">
            Déconnexion
        </button>
      </div>

      {/* Selecteur d'org si nécessaire */}
      {authData.organizations.length > 1 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <span className="mr-2">Changer d'entreprise :</span>
              {authData.organizations.map(org => (
                  <button 
                    key={org.orgId}
                    onClick={() => { /* Appel trpc.auth.switchOrg */ }}
                    className={`mr-2 px-2 py-1 rounded ${org.orgId === authData.activeOrgId ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  >
                      {org.name}
                  </button>
              ))}
          </div>
      )}

      {/* Tes composants existants ici */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded border">
            <h2 className="text-xl font-bold mb-4">Réservations</h2>
            {/* Composant BookingsList ici qui appelle trpc.bookings.list */}
        </div>
        {/* ... Services, Customers */}
      </div>
    </div>
  );
}
