import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserCommunicator } from "@/core/domain/implementation/BrowserCommunicator.ts";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App communicator={new BrowserCommunicator()} />
  </StrictMode>,
);
