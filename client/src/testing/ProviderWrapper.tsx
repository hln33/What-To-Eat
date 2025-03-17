import { ParentComponent } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { UserContextProvider } from "@/contexts/UserContext";
import MainLayout from "@/app/layouts/MainLayout";

const ProviderWrapper: ParentComponent = (props) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <Router root={MainLayout}>
          <Route
            path="/"
            component={() => props.children}
          />
        </Router>
      </UserContextProvider>
    </QueryClientProvider>
  );
};

export default ProviderWrapper;
