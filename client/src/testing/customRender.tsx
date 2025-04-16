import { JSX } from "solid-js";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/solid-router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { render as baseRender } from "@solidjs/testing-library";

import { RootComponent } from "@/routes/__root";
import { UserContextProvider } from "@/contexts/UserContext";

const createTestRouter = (component: () => JSX.Element) => {
  const rootRoute = createRootRoute({ component: RootComponent });
  const componentRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([componentRoute]),
  });

  return router;
};

/**
 * When using this custom render function, the first element that is queried using Testing Library
 * must be waited upon until it is in the document. One way to do this is to use a `findBy` query.
 */
const customRender = (component: () => JSX.Element) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return baseRender(() => (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <RouterProvider router={createTestRouter(component)} />
      </UserContextProvider>
    </QueryClientProvider>
  ));
};

export default customRender;
