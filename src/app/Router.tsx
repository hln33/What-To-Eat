import { ParentComponent } from "solid-js";
import { Route, Router } from "@solidjs/router";
import Home from "./routes/Home";

const Layout: ParentComponent = (props) => {
  return (
    <div class="min-h-screen bg-slate-900 p-20 text-center text-white">
      <header class="py-20">
        <h1 class="text-6xl">What to Eat?</h1>
      </header>

      <main class="border-slate-600 bg-slate-800">{props.children}</main>
    </div>
  );
};

const AppRouter = () => (
  <Router root={Layout}>
    <Route
      path="/"
      component={Home}
    />
    <Route path="/recipe" />
  </Router>
);

export default AppRouter;
