import { Route, Router } from "@solidjs/router";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { UserContextProvider } from "@/contexts/UserContext";
import HomePage from "./pages/Home";
import RecipePage from "./pages/Recipe";
import LoginPage from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import MainLayout from "./layouts/MainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import RecipeNewPage from "./pages/RecipeNew";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SolidQueryDevtools initialIsOpen={false} />
    <UserContextProvider>
      <Router root={MainLayout}>
        <Route
          path="/"
          component={HomePage}
        />
        <Route
          path="/recipe/new"
          component={RecipeNewPage}
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
  </QueryClientProvider>
);

export default App;
