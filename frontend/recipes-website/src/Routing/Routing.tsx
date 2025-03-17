import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginRedirector from "../components/loginRedirector";
import AddRecipePage from "../LayoutArea/pages/AddRecipePage";
import HomePage from "../LayoutArea/pages/HomePage";
import LoginPage from "../LayoutArea/pages/LoginPage";
import SignUpPage from "../LayoutArea/pages/SignUpPage";
import { ROUTES } from "./routes";
import UserProfile from "../LayoutArea/pages/UserProfile";
import ProtectedRoute from "../components/ProtectedRoutes";
import RecipeGenerator from "../LayoutArea/pages/RecipeGeneratorPage";

const Routing = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
      <Route path="/verify-auth" element={<LoginRedirector />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.ADD_RECIPE} element={<AddRecipePage />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.USER_PROFILE} element={<UserProfile />} />
        <Route path={ROUTES.RECIPE_GENERATOR} element={<RecipeGenerator />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.VERIFY_AUTH} />} />
    </Routes>
  );
};

export default Routing;
