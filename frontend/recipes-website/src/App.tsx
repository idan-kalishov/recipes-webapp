import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ROUTES } from "./routes";
import ProtectedRoute from "./components/protectedRoutes";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LoginRedirector from "./components/loginRedirector";
import SignUpPage from "./pages/SignUpPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />

        <Route path="/verify-auth" element={<LoginRedirector />} />

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.VERIFY_AUTH} />} />
      </Routes>
    </Router>
  );
};

export default App;
