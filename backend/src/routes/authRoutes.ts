import express from "express";
const authRouter = express.Router();
import authController from "../controllers/authController";

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.post("/refresh", authController.refresh);


authRouter.post("/logout", authController.logout);


export default authRouter;
