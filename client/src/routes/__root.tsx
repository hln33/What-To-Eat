import { ParentComponent, Show } from "solid-js";
import {
  Link,
  Outlet,
  createRootRoute,
  useNavigate,
} from "@tanstack/solid-router";
import { createMutation } from "@tanstack/solid-query";

import { createSessionQuery } from "@/queries";
import { useUserContext } from "@/contexts/UserContext";
import { logout } from "@/features/users/api";
import Skeleton from "@/components/ui/Skeleton";
import { ToastRegion } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

export const RootComponent: ParentComponent = () => {
  const navigate = useNavigate();
  const user = useUserContext();

  const sessionQuery = createSessionQuery();
  const logoutMutation = createMutation(() => ({
    mutationFn: logout,
    onSuccess: () => user.logout(),
  }));

  return (
    <div class="h-fit min-h-screen bg-gray-800 text-center text-white">
      <header class="flex flex-row items-center justify-between border-b border-slate-600 bg-slate-950 px-10 py-5">
        <Link
          to="/"
          class="text-4xl"
        >
          What to eat?
        </Link>

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
            <Link to="/">Home</Link>

            <Show
              when={user.info.isLoggedIn}
              fallback={<Link to="/Login">Login</Link>}
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

      <div class="flex items-center justify-center py-8">
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
