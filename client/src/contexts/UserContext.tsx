import {
  createContext,
  createEffect,
  ParentComponent,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { createSessionQuery } from "@/queries";

type User = {
  id: string | null;
  name: string | null;
  isLoggedIn: boolean;
};

const UserContext = createContext<{
  info: User;
  login: (userId: string, username: string) => void;
  logout: () => void;
}>();

export const UserContextProvider: ParentComponent = (props) => {
  const [user, setUser] = createStore<User>({
    id: null,
    name: null,
    isLoggedIn: false,
  });

  const sessionQuery = createSessionQuery();
  createEffect(() => {
    if (sessionQuery.data === undefined) {
      return;
    }

    if (sessionQuery.data !== null) {
      login(sessionQuery.data.userId, sessionQuery.data.username);
    } else {
      logout();
    }
  });

  const login = (userId: string, username: string) =>
    setUser({
      id: userId,
      name: username,
      isLoggedIn: true,
    });
  const logout = () =>
    setUser({
      id: null,
      name: null,
      isLoggedIn: false,
    });

  return (
    <UserContext.Provider value={{ info: user, login, logout }}>
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
