import { ParentComponent } from "solid-js";
import { Route, Router } from "@solidjs/router";
import HomePage from "./pages/Home";
import RecipePage from "./pages/Recipe";
import LoginPage from "./pages/Login";

const Layout: ParentComponent = (props) => {
  return (
    <div class="min-h-screen bg-slate-900 text-center text-white">
      <header class="py-12">
        <h1 class="text-6xl">What to Eat?</h1>
      </header>

      <main class="w-screen border border-slate-600 bg-slate-800 p-12 sm:m-5 sm:w-96 sm:max-w-screen-2xl">
        {props.children}
      </main>
    </div>
  );
};

const AppRouter = () => (
  <Router root={Layout}>
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
  </Router>
);

export default AppRouter;
