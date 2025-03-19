// server.ts (or app.ts)
import express, { Application } from "express";
import mongoose from "mongoose";
import commentsRoutes from "./routes/commentsRoute";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import initializePassport from "./passport";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import userRouter from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";

export function createServer(): Application {
    dotenv.config();

    const app: Application = express();

    // Initialize Passport for Google OAuth strategy etc.
    initializePassport();
    app.use(passport.initialize());
    app.use(cookieParser());
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    app.use(
        cors({
            origin: "http://localhost:5173", // TODO: replace with the actual domain or IP
            credentials: true,
        })
    );

    // Serve static files (e.g., uploaded images)
    app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

    // Swagger configuration
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev 2025 REST API",
                version: "1.0.0",
                description: "REST server including authentication using JWT",
            },
            servers: [{ url: "http://localhost:3000" }],
        },
        apis: ["./src/routes/*.ts"],
    };

    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

    // Additional middleware
    app.use(express.json());
    app.use(bodyParser.json());

    // Set up routes
    app.use("/comments", commentsRoutes);
    app.use("/posts", postRoutes);
    app.use("/auth", authRoutes);
    app.use("/user", userRouter);

    // Connect to MongoDB
    if (!process.env.DB_CONNECT) {
        throw new Error("DB_CONNECT environment variable is not defined");
    }

    mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => console.log("Connected to the database"))
        .catch((err: Error) => console.error("MongoDB connection error:", err));

    return app;
}
