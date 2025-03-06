import { ParentComponent } from "solid-js";
import { A, Route, Router } from "@solidjs/router";
import HomePage from "./pages/Home";
import RecipePage from "./pages/Recipe";
import LoginPage from "./pages/Login";

const Layout: ParentComponent = (props) => {
  return (
    <div class="min-h-screen bg-slate-900 text-center text-white">
      <header class="flex flex-row items-center justify-between p-5">
        <A
          href="/"
          class="text-4xl"
        >
          What to Eat?
        </A>

        <nav class="border border-white p-2">
          <A href="/login">Login</A>
        </nav>
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
