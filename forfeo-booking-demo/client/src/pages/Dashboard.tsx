import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { data: user, isLoading, error } = trpc.auth.me.useQuery();

  // Chargement
  if (isLoading) {
    return <p>Chargement...</p>;
  }

  // Non connecté → redirection login
  if (error || !user) {
    window.location.href = getLoginUrl();
    return null;
  }

  // Connecté
  return (
    <div style={{ padding: 32 }}>
      <h1>Dashboard</h1>
      <p>Bienvenue <strong>{user.name}</strong></p>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 16,
          borderRadius: 8,
          marginTop: 16,
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
