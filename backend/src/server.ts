// server.ts (or app.ts)
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import mongoose from "mongoose";
import passport from "passport";
import path from "path";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import initializePassport from "./passport";
import authRoutes from "./routes/authRoutes";
import commentsRoutes from "./routes/commentsRoute";
import postRoutes from "./routes/postRoutes";
import userRouter from "./routes/userRoutes";

export function createServer(): Application {
  dotenv.config();

  const app: Application = express();

  

  // Initialize Passport for Google OAuth strategy etc.
  initializePassport();
  app.use(passport.initialize());
  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://node32.cs.colman.ac.il"
      : "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

  // Serve static files (e.g., uploaded images)
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  const clientBuildPath = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientBuildPath));


  // Swagger configuration
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Web Dev 2025 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT",
      },
      servers: [{ url: "http://localhost:3000" }, { url: "http://10.10.246.32:80" }, { url: "https://10.10.246.32" }, { url: "https://node32.cs.colman.ac.il" }],
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

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });

  if (!process.env.DB_CONNECT) {
    throw new Error("DB_CONNECT environment variable is not defined");
  }

  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => console.log("Connected to the database"))
    .catch((err: Error) => console.error("MongoDB connection error:", err));

  return app;
}
