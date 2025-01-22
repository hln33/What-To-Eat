import { type Component } from "solid-js";
import SelectEssentials from "./components/SelectEssentials";

const App: Component = () => {
  return (
    <div class="min-h-screen bg-slate-900 p-52 text-center text-white">
      <header class="py-28">
        <h1 class="text-6xl">What to Eat?</h1>
      </header>
      <main class="flex flex-col">
        <SelectEssentials />
      </main>
    </div>
  );
};

export default App;
