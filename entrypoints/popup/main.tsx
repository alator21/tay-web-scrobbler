import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserCommunicator } from "@/core/domain/implementation/BrowserCommunicator.ts";
import { Popup } from "./Popup.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Popup communicator={new BrowserCommunicator()} />
  </StrictMode>,
);
