import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  ParentComponent,
  useContext,
} from "solid-js";
import { createSessionQuery } from "@/queries";

const UserContext = createContext<{
  id: Accessor<string | null>;
  isLoggedIn: Accessor<boolean>;
  login: (userId: string) => void;
  logout: () => void;
}>();

export const UserContextProvider: ParentComponent = (props) => {
  const [id, setId] = createSignal<string | null>(null);
  const [isLoggedIn, setIsLoggedin] = createSignal(false);

  const sessionExistanceQuery = createSessionQuery();
  createEffect(() => {
    if (sessionExistanceQuery.data === undefined) {
      return;
    }

    if (sessionExistanceQuery.data !== null) {
      login(sessionExistanceQuery.data.userId);
    } else {
      logout();
    }
  });

  const login = (userId: string) => {
    setId(userId);
    setIsLoggedin(true);
  };
  const logout = () => {
    setId(null);
    setIsLoggedin(false);
  };

  return (
    <UserContext.Provider value={{ id, login, logout, isLoggedIn }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("cannot find UserContext");
  }
  return context;
};
