import { Route, Switch } from "wouter";
import Home from "./Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/" component={Home} />
      {/* Autres routes */}
    </Switch>
  );
}
export default App;
