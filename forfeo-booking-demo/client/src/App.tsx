import { Route, Switch } from "wouter";

import Home from "@/pages/Home";
import Bookings from "@/pages/Bookings";
import Services from "@/pages/Services";
import Customers from "@/pages/Customers";
import Chat from "@/pages/Chat";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      <Route path="/bookings" component={Bookings} />
      <Route path="/services" component={Services} />
      <Route path="/customers" component={Customers} />
      <Route path="/chat" component={Chat} />

      {/* Fallback si aucune route match */}
      <Route component={NotFound} />
    </Switch>
  );
}
