/* @refresh reload */
import { render } from "solid-js/web";
import { RouterProvider, createRouter } from "@tanstack/solid-router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";

import "./index.css";
import { routeTree } from "./routeTree.gen";
import { UserContextProvider } from "./contexts/UserContext";

const router = createRouter({ routeTree });

declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById("root");
if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

const queryClient = new QueryClient();
render(
  () => (
    <QueryClientProvider client={queryClient}>
      <SolidQueryDevtools initialIsOpen={false} />
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </QueryClientProvider>
  ),
  root!,
);
