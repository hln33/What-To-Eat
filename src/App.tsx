import { type Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";

const App: Component = () => {
  return (
    <div class="text-center">
      <header class={styles.header}>
        <h1>What to Eat?</h1>
      </header>
      <main>
        <h1>Essentials</h1>
      </main>
    </div>
  );
};

export default App;
