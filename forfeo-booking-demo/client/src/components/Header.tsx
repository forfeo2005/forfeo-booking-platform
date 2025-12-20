import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function Header() {
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleLogout = async () => {
    await fetch("/api/oauth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        borderBottom: "1px solid #eee",
      }}
    >
      <strong>Forfeo Booking</strong>

      {isLoading ? (
        <span>...</span>
      ) : user ? (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span>👋 {user.name}</span>
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Se connecter</button>
      )}
    </header>
  );
}
