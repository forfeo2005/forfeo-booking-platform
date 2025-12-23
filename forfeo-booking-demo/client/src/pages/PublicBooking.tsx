import { useRoute } from "wouter";

export default function PublicBooking() {
  // On récupère le nom de l'entreprise dans l'URL (le slug)
  const [match, params] = useRoute("/book/:slug");
  const slug = params?.slug;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-10 text-center border border-gray-100">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-2xl font-bold">
          {slug?.charAt(0).toUpperCase()}
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenue chez {slug?.toUpperCase()}
        </h1>
        
        <p className="text-gray-500 mb-8 text-lg">
          Réservez votre moment de détente en quelques clics.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-blue-800 mb-2">Service disponible : SPA</h3>
          <p className="text-blue-600 text-sm mb-4">60 min • 50 $ CAD</p>
          <button className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition shadow-md">
            Réserver maintenant
          </button>
        </div>
      </div>
    </div>
  );
}