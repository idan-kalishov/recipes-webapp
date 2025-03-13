import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import React from "react";
import "./index.css";
import {Layout} from "./LayoutArea/Layout";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Layout/>
        </BrowserRouter>
    </StrictMode>
);
