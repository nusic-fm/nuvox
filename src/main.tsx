import { ThemeProvider } from "@mui/material/styles";
import React from "react";
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

const router = createHashRouter([
  {
    path: "/",
    element: (
      <WithNavbar>
        <App />
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
    path: "/player",
    element: (
      <WithNavbar>
        <VoxPlayer />
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
