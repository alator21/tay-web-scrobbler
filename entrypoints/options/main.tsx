import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserCommunicator } from "@/core/domain/implementation/BrowserCommunicator.ts";
import { Options } from "./Options";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Options communicator={new BrowserCommunicator()} />
  </StrictMode>,
);
