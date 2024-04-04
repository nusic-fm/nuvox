import { ThemeProvider } from "@mui/material/styles";
import React, { createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import "./index.css";
import theme from "./theme";
import {
  // createBrowserRouter,
  createHashRouter,
  RouterProvider,
  // Route,
  // Link,
} from "react-router-dom";
import App from "./App";
import DecodeHash from "./DecodeHash";
import VoxPlayer from "./VoxPlayer";
import SyncLedger from "./SyncLedger";
import WithNavbar from "./components/WithNavBar";
import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalStateProvider from "./components/providers/GlobalStateProvider";

export const GlobalStateContext = createContext<any>(null);

export const useGlobalState = () => useContext(GlobalStateContext);

const router = createHashRouter([
  {
    path: "/",
    element: (
      <WithNavbar>
        <VoxPlayer />
      </WithNavbar>
    ),
  },
  {
    path: "/decode",
    element: (
      <WithNavbar>
        <DecodeHash />
      </WithNavbar>
    ),
  },
  {
    path: "/create",
    element: (
      <WithNavbar>
        <App />
      </WithNavbar>
    ),
  },
  {
    path: "/sync-ledger",
    element: (
      <WithNavbar>
        <SyncLedger />
      </WithNavbar>
    ),
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <GlobalStateProvider>
            <RouterProvider router={router} />
          </GlobalStateProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  </React.StrictMode>
);
