import { ParentComponent, Show } from "solid-js";
import { A } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";

import { createSessionQuery } from "@/queries";
import { useUserContext } from "@/contexts/UserContext";
import { logout } from "@/features/users/api";
import Skeleton from "@/components/ui/Skeleton";
import { ToastRegion } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

const MainLayout: ParentComponent = (props) => {
  const user = useUserContext();

  const sessionQuery = createSessionQuery();
  const logoutMutation = createMutation(() => ({
    mutationFn: logout,
    onSuccess: () => user.logout(),
  }));

  return (
    <div class="h-fit min-h-screen bg-gray-800 text-center text-white">
      <header class="flex flex-row items-center justify-between border-b border-slate-600 bg-slate-950 px-10 py-5">
        <A
          href="/"
          class="text-4xl"
        >
          What to Eat?
        </A>

        <nav class="flex space-x-5">
          <Show
            when={sessionQuery.data !== undefined}
            fallback={
              <Skeleton
                height={60}
                width={200}
              />
            }
          >
            <A
              class="block border border-white p-2"
              href="/"
            >
              Home
            </A>

            <Show
              when={user.info.isLoggedIn}
              fallback={
                <A
                  class="block border border-white p-2"
                  href="/login"
                >
                  Login
                </A>
              }
            >
              <Button
                variant="subtle"
                loading={logoutMutation.isPending}
              >
                <A
                  class="block border border-white p-2"
                  href="/"
                  onClick={() => logoutMutation.mutate()}
                >
                  Logout
                </A>
              </Button>
            </Show>
          </Show>
        </nav>
      </header>

      <div class="flex items-center justify-center py-8">
        <main class="w-screen p-5">{props.children}</main>
      </div>
      <ToastRegion />
    </div>
  );
};

export default MainLayout;
