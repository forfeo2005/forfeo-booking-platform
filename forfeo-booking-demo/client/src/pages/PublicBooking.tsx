import { useRoute } from "wouter";
import { trpc } from "../utils/trpc";

export default function PublicBooking() {
  // 1. Récupère le "slug" dans l'adresse (ex: 'forfeo')
  const [match, params] = useRoute("/book/:slug");
  const slug = params?.slug;

  // 2. Demande les infos réelles à la base de données
  const { data: org, isLoading: loadingOrg } = trpc.organizations.getBySlug.useQuery(slug || "");
  const { data: services, isLoading: loadingServices } = trpc.services.listByOrgSlug.useQuery(slug || "");

  // 3. Pendant le chargement des données
  if (loadingOrg || loadingServices) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl font-semibold text-gray-400">Chargement de votre boutique...</div>
      </div>
    );
  }

  // 4. Si l'entreprise n'existe pas
  if (!org) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-red-500 text-5xl mb-4">😕</h1>
          <p className="text-gray-800 font-bold text-xl">Entreprise introuvable</p>
          <p className="text-gray-500 mt-2">Vérifiez l'adresse : /book/{slug}</p>
        </div>
      </div>
    );
  }

  // 5. Affichage FINAL avec les vraies données
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* En-tête de l'entreprise */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-700 text-3xl font-bold mb-4 shadow-sm">
            {org.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{org.name}</h1>
          <p className="text-gray-500 mt-2">Réservez votre séance en ligne</p>
        </div>

        {/* Liste des services */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 ml-1">Prestations disponibles ({services?.length || 0})</h2>
          
          {services?.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-400">Aucun service n'est encore disponible à la réservation.</p>
            </div>
          ) : (
            services?.map((service) => (
              <div key={service.id} className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-500 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {service.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <span className="flex items-center bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 mr-3">
                      ⏳ {service.duration} min
                    </span>
                    <span>Détente & Bien-être</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                  <span className="text-2xl font-bold text-gray-900">{service.price} $</span>
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-green-600 hover:scale-105 active:scale-95 transition-all">
                    Réserver
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-12 text-gray-400 text-sm">
          Propulsé par <span className="font-semibold text-gray-600">Forfeo</span>
        </div>
      </div>
    </div>
  );
}