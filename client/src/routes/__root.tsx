import { ParentComponent, Show } from "solid-js";
import {
  Link,
  Outlet,
  createRootRoute,
  useNavigate,
} from "@tanstack/solid-router";

import { useUserContext } from "@/contexts/UserContext";
import {
  createUserLogoutMutation,
  userQueries,
} from "@/features/users/queries";
import Skeleton from "@/components/ui/Skeleton";
import { ToastRegion } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import { createQuery } from "@tanstack/solid-query";

export const RootComponent: ParentComponent = () => {
  const navigate = useNavigate();
  const user = useUserContext();

  const sessionQuery = createQuery(() => userQueries.session());
  const logoutMutation = createUserLogoutMutation();

  return (
    <div class="h-fit min-h-screen bg-gray-800 text-center text-white">
      <header class="flex items-center justify-between border-b border-slate-600 bg-slate-950 p-5">
        <Link
          to="/"
          class="text-3xl"
        >
          What to eat?
        </Link>

        <nav class="flex items-center space-x-2">
          <Show
            when={sessionQuery.data !== undefined}
            fallback={
              <Skeleton
                height={60}
                width={200}
              />
            }
          >
            <Link
              to="/"
              class="text-xl"
              activeProps={{ class: "text-blue-400 font-bold" }}
            >
              Home
            </Link>

            <Show
              when={user.info.isLoggedIn}
              fallback={<Link to="/login">Login</Link>}
            >
              <Button
                variant="subtle"
                loading={logoutMutation.isPending}
                onClick={() => {
                  logoutMutation.mutate(undefined, {
                    onSuccess: () => {
                      navigate({ to: "/" });
                    },
                  });
                }}
              >
                Logout
              </Button>
            </Show>
          </Show>
        </nav>
      </header>

      <div class="flex items-center justify-center pb-8 pt-2">
        <main class="w-screen p-5">
          <Outlet />
        </main>
      </div>
      <ToastRegion />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
