import { Link, useLocation } from "wouter";
import { trpc } from "../utils/trpc";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  // Fonction de déconnexion
  const logoutMutation = trpc.auth.logout.useMutation({
     onSuccess: () => window.location.href = "/login"
  });

  // Définition des liens du menu
  const menuItems = [
    { label: "Tableau de Bord", href: "/dashboard", icon: "📊" },
    { label: "Mes Services", href: "/services", icon: "🛠️" },
    { label: "Réservations", href: "/bookings", icon: "📅" },
    { label: "Clients", href: "/customers", icon: "👥" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barre Latérale (Sidebar) Fixe */}
      <aside className="w-64 bg-white shadow-md flex flex-col fixed h-full z-10">
        <div className="p-6 border-b flex items-center justify-center">
          <h2 className="text-2xl font-bold text-blue-600 tracking-tight">Forfeo</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
             const isActive = location === item.href;
             return (
               <Link key={item.href} href={item.href} className={`
                 flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer no-underline
                 ${isActive 
                   ? "bg-blue-50 text-blue-700 font-bold border-r-4 border-blue-600" 
                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
               `}>
                   <span className="text-xl">{item.icon}</span>
                   <span>{item.label}</span>
               </Link>
             );
          })}
        </nav>

        {/* Bouton Déconnexion en bas */}
        <div className="p-4 border-t bg-gray-50">
          <button 
            onClick={() => logoutMutation.mutate()}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-100 w-full rounded-lg transition-colors font-medium"
          >
            <span className="text-xl">🚪</span>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu Principal (décalé de 64 pour laisser la place au menu) */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
// Menu Fix v1
