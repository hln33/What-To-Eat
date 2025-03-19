import { ParentComponent, Show } from "solid-js";
import { A } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";
import { useUserContext } from "@/contexts/UserContext";
import { logout } from "@/features/users/api";
import { createSessionExistanceQuery } from "@/queries";
import Skeleton from "@/components/ui/Skeleton";
import { ToastRegion } from "@/components/ui/Toast";

const MainLayout: ParentComponent = (props) => {
  const user = useUserContext();

  const sessionExistanceQuery = createSessionExistanceQuery();

  const logoutUser = createMutation(() => ({
    mutationFn: logout,
    onSuccess: () => {
      user.setIsLoggedin(false);
    },
  }));

  return (
    <div class="h-fit min-h-screen space-y-20 bg-gray-800 text-center text-white">
      <header class="flex flex-row items-center justify-between border-b border-slate-600 bg-slate-950 px-10 py-5">
        <A
          href="/"
          class="text-4xl"
        >
          What to Eat?
        </A>

        <nav class="flex space-x-5">
          <A
            class="block border border-white p-2"
            href="/"
          >
            Home
          </A>

          <Show
            when={sessionExistanceQuery.data !== undefined}
            fallback={
              <Skeleton
                height={40}
                width={120}
              />
            }
          >
            <Show
              when={user.isLoggedin()}
              fallback={
                <>
                  <A
                    class="block border border-white p-2"
                    href="/login"
                  >
                    Login
                  </A>
                  <A
                    class="block border border-white p-2"
                    href="/signup"
                  >
                    Sign Up
                  </A>
                </>
              }
            >
              <A
                class="block border border-white p-2"
                href="/"
                onClick={() => logoutUser.mutate()}
              >
                Logout
              </A>
            </Show>
          </Show>
        </nav>
      </header>

      <div class="flex items-center justify-center">
        <main class="w-screen p-5">{props.children}</main>
      </div>
      <ToastRegion />
    </div>
  );
};

export default MainLayout;
