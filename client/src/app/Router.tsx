import { Route, Router } from "@solidjs/router";
import { UserContextProvider } from "@/contexts/UserContext";
import HomePage from "./pages/Home";
import RecipePage from "./pages/Recipe";
import LoginPage from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import MainLayout from "./layouts/MainLayout";

const App = () => (
  <UserContextProvider>
    <Router root={MainLayout}>
      <Route
        path="/"
        component={HomePage}
      />
      <Route
        path="/recipe/:id"
        component={RecipePage}
      />
      <Route
        path="/login"
        component={LoginPage}
      />
      <Route
        path="/signup"
        component={SignupPage}
      />
    </Router>
  </UserContextProvider>
);

export default App;
