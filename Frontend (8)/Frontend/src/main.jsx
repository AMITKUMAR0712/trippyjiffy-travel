import { StrictMode } from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Router/router";
import { prefetchShellData } from "./utils/siteShellData";

import { HelmetProvider } from "react-helmet-async";

prefetchShellData();

const hideBootPreloader = () => {
  document.getElementById("root-preloader")?.remove();
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>
);

hideBootPreloader();
