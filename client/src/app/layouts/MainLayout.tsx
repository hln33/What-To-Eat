import { createEffect, ParentComponent, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useUserContext } from "@/contexts/UserContext";
import { checkUserSessionExists, logout } from "@/features/users/api";
import { createQuery } from "@tanstack/solid-query";

const MainLayout: ParentComponent = (props) => {
  const user = useUserContext();

  const sessionExistanceQuery = createQuery(() => ({
    queryKey: ["session"],
    queryFn: checkUserSessionExists,
  }));

  createEffect(() => {
    if (sessionExistanceQuery.data !== undefined) {
      user.setIsLoggedin(sessionExistanceQuery.data);
    }
  });

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
              onClick={() => {
                logout();
                user.setIsLoggedin(false);
              }}
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

export default MainLayout;
