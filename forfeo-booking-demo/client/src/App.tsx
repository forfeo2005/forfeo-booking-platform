import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

/* -------------------------------------------------
   ROUTER
------------------------------------------------- */
function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

/* -------------------------------------------------
   APP (MODE DEV : AUTH SIMULÉE)
------------------------------------------------- */
function App() {
  // 🔥 MODE DEV : TOUJOURS CONNECTÉ
  const isDevMode = true;

  if (!isDevMode) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Forfeo Booking</h1>
        <p>Authentification requise</p>
      </div>
    );
  }

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
