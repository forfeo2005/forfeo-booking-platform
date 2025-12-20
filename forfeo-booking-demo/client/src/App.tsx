import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { getLoginUrl } from "./const";

/* -------------------------------------------------
   ROUTER
------------------------------------------------- */
function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

/* -------------------------------------------------
   APP (AUTH ENTRY POINT)
------------------------------------------------- */
function App() {
  const isBrowser = typeof window !== "undefined";

  // Simple auth check: cookie must exist
  const hasCookie =
    isBrowser && typeof document !== "undefined" && document.cookie.length > 0;

  // NOT AUTHENTICATED → LOGIN SCREEN
  if (!hasCookie) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
          background: "#f9fafb",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>
          Forfeo Booking
        </h1>

        <button
          onClick={() => {
            window.location.href = getLoginUrl();
          }}
          style={{
            padding: "12px 24px",
            fontSize: 16,
            fontWeight: 500,
            cursor: "pointer",
            borderRadius: 6,
            border: "none",
            background: "#4f46e5",
            color: "white",
          }}
        >
          Se connecter
        </button>
      </div>
    );
  }

  // AUTHENTICATED → APP
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
