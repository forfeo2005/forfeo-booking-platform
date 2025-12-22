import { useState } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { queryClient } from "./lib/queryClient";
import { trpc } from "./utils/trpc";
import superjson from "superjson";

// Import Home depuis la racine src
import Home from "./Home"; 

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Pages internes (Tableau de bord)
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import Customers from "./pages/Customers";

// Layout
import DashboardLayout from "./components/DashboardLayout";

function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

function Router() {
  return (
    <Switch>
      {/* Routes Publiques */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      {/* Routes Protégées */}
      <Route path="/dashboard"><Layout><Dashboard /></Layout></Route>
      <Route path="/services"><Layout><Services /></Layout></Route>
      <Route path="/bookings"><Layout><Bookings /></Layout></Route>
      <Route path="/customers"><Layout><Customers /></Layout></Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
