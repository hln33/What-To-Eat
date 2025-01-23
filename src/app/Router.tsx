import { ParentComponent } from "solid-js";
import { Route, Router } from "@solidjs/router";
import HomePage from "./pages/Home";
import RecipePage from "./pages/Recipe";

const Layout: ParentComponent = (props) => {
  return (
    <div class="min-h-screen bg-slate-900 p-20 text-center text-white">
      <header class="py-12">
        <h1 class="text-6xl">What to Eat?</h1>
      </header>

      <main class="border border-slate-600 bg-slate-800 p-12">
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
      path="/recipe"
      component={RecipePage}
    />
  </Router>
);

export default AppRouter;
