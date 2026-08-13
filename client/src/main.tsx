import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => undefined);
}

createRoot(document.getElementById("root")!).render(<App />);
