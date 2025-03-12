import {Navigate, Route, Routes} from "react-router-dom";
import {ROUTES} from "./routes";
import LoginPage from "../LayoutArea/pages/LoginPage";
import SignUpPage from "../LayoutArea/pages/SignUpPage";
import LoginRedirector from "../components/loginRedirector";
import ProtectedRoute from "../components/ProtectedRoutes";
import AddRecipePage from "../LayoutArea/pages/AddRecipePage";
import HomePage from "../LayoutArea/pages/HomePage";
import React from "react";

const Routing = () => {
    return (
            <Routes>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
                <Route path="/verify-auth" element={<LoginRedirector />} />

                <Route element={<ProtectedRoute />}>
                    <Route path={ROUTES.ADD_RECIPE} element={<AddRecipePage/>} />
                    <Route path={ROUTES.HOME} element={<HomePage />} />
                </Route>
                <Route path="*" element={<Navigate to={ROUTES.VERIFY_AUTH} />} />
            </Routes>
    );
};

export default Routing;