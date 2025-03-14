import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import { Layout } from "./LayoutArea/Layout";
import store, { persistor } from "./store/appState";
import { PollingProvider } from "./components/PollingProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <PollingProvider>
            <Layout />
          </PollingProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
