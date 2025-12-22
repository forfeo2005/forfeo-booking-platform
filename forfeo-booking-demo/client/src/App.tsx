// Fichier: client/src/App.tsx
import { useState } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { queryClient } from "./lib/queryClient";
import { trpc } from "./utils/trpc";
import { Toaster } from "@/components/ui/toaster"; // Garde ça si tu utilises shadcn, sinon retire
import superjson from "superjson"; // Assure-toi d'avoir installé superjson côté client aussi

// Imports des pages
import Home from "./Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      {/* Route 404 simple */}
      <Route>
        <div className="flex items-center justify-center h-screen">404 - Page non trouvée</div>
      </Route>
    </Switch>
  );
}

function App() {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          // L'URL de ton backend. En prod (même domaine), "/api/trpc" suffit.
          url: "/api/trpc",
          
          // Transformer est important si tu utilises superjson côté serveur
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router />
        {/* <Toaster />  <-- Décommente si tu as le composant Toaster */}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
