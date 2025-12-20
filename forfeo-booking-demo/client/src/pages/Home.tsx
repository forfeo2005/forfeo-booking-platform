import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: user, isLoading, error } = trpc.auth.me.useQuery();

  if (isLoading) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Home</h1>
        <p>Chargement de l’utilisateur…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Home</h1>
        <p style={{ color: "red" }}>
          Erreur lors du chargement de l’utilisateur : {error.message}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Home</h1>

      <h2>Utilisateur connecté (mode DEV)</h2>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 20,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
