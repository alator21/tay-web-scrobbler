import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChromeCommunicator } from "../ChromeCommunicator.ts";
import { App } from "../../../core/ui/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App communicator={new ChromeCommunicator()} />
  </StrictMode>,
);
