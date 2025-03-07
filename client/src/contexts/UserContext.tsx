import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  ParentComponent,
  Setter,
  useContext,
} from "solid-js";

const UserContext = createContext<{
  isLoggedin: Accessor<boolean>;
  setIsLoggedin: Setter<boolean>;
}>();

export const UserContextProvider: ParentComponent = (props) => {
  const [isLoggedin, setIsLoggedin] = createSignal(false);

  createEffect(() => {
    console.log(isLoggedin());
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
