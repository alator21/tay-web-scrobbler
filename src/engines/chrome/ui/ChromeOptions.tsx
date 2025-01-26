import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChromeCommunicator } from "../ChromeCommunicator.ts";
import { Options } from "../../../core/ui/options/Options.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Options communicator={new ChromeCommunicator()} />
  </StrictMode>,
);
