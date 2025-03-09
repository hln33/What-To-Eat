import { ParentComponent, Show } from "solid-js";
import { A, Route, Router } from "@solidjs/router";
import { UserContextProvider, useUserContext } from "@/contexts/UserContext";
import HomePage from "./pages/Home";
import RecipePage from "./pages/Recipe";
import LoginPage from "./pages/Login";
import { SignupPage } from "./pages/Signup";

const Layout: ParentComponent = (props) => {
  const user = useUserContext();

  return (
    <div class="h-fit min-h-screen space-y-20 bg-slate-900 text-center text-white">
      <header class="flex flex-row items-center justify-between border-b border-slate-600 bg-slate-950 px-10 py-5">
        <A
          href="/"
          class="text-4xl"
        >
          What to Eat?
        </A>
        <nav class="space-x-5">
          <A
            class="border border-white p-2"
            href="/"
          >
            Home
          </A>

          <Show
            when={user.isLoggedin()}
            fallback={
              <>
                <A
                  class="border border-white p-2"
                  href="/login"
                >
                  Login
                </A>
                <A
                  class="border border-white p-2"
                  href="/signup"
                >
                  Sign Up
                </A>
              </>
            }
          >
            <A
              class="border border-white p-2"
              href="/"
              onClick={() => user.setIsLoggedin(false)}
            >
              Logout
            </A>
          </Show>
        </nav>
      </header>

      <div class="flex items-center justify-center">
        <main class="w-screen border border-slate-600 bg-slate-800 p-8">
          {props.children}
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <UserContextProvider>
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
      <Route
        path="/signup"
        component={SignupPage}
      />
    </Router>
  </UserContextProvider>
);

export default App;
