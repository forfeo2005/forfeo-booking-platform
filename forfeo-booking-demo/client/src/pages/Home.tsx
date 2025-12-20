import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: user, isLoading, isError } = trpc.auth.me.useQuery();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError || !user) {
    return (
      <div>
        <h1>Forfeo Booking</h1>
        <p>Vous devez être connecté pour continuer.</p>
        <button
          onClick={() => {
            window.location.href = "/api/oauth/login";
          }}
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Forfeo Booking</h1>
      <p>Bienvenue {user.name}</p>

      {/* La suite du module de réservation viendra ici */}
    </div>
  );
}
