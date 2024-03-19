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

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/decode",
    element: <DecodeHash />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
