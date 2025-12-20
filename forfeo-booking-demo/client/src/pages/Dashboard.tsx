import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading, isError } = trpc.auth.me.useQuery();

  // ⏳ Chargement
  if (isLoading) {
    return <p style={{ padding: 32 }}>Chargement...</p>;
  }

  // 🔒 Non connecté → redirection
  if (isError || !user) {
    // 👉 redirection propre (pas de side-effect direct dans le render)
    setTimeout(() => {
      window.location.href = getLoginUrl();
    }, 0);

    return null;
  }

  // ✅ Connecté
  return (
    <div style={{ padding: 32 }}>
      <h1>Dashboard</h1>
      <p>
        Bienvenue <strong>{user.name}</strong>
      </p>

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
