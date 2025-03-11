import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  ParentComponent,
  Setter,
  useContext,
} from "solid-js";
import { createSessionExistanceQuery } from "@/queries";

const UserContext = createContext<{
  isLoggedin: Accessor<boolean>;
  setIsLoggedin: Setter<boolean>;
}>();

export const UserContextProvider: ParentComponent = (props) => {
  const [isLoggedin, setIsLoggedin] = createSignal(false);

  const sessionExistanceQuery = createSessionExistanceQuery();
  createEffect(() => {
    if (sessionExistanceQuery.data !== undefined) {
      setIsLoggedin(sessionExistanceQuery.data);
    }
  });

  const loggedInState = { isLoggedin, setIsLoggedin };
  return (
    <UserContext.Provider value={loggedInState}>
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
