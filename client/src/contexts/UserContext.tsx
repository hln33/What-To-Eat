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
  username: Accessor<string | null>;
  isLoggedIn: Accessor<boolean>;
  login: (userId: string) => void;
  logout: () => void;
}>();

export const UserContextProvider: ParentComponent = (props) => {
  const [id, setId] = createSignal<string | null>(null);
  const [username, setUserName] = createSignal<string | null>(null);
  const [isLoggedIn, setIsLoggedin] = createSignal(false);

  const sessionQuery = createSessionQuery();
  createEffect(() => {
    if (sessionQuery.data === undefined) {
      return;
    }

    if (sessionQuery.data !== null) {
      setUserName(sessionQuery.data.username);
      login(sessionQuery.data.userId);
    } else {
      setUserName(null);
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
    <UserContext.Provider value={{ id, username, login, logout, isLoggedIn }}>
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
