import express, { Application } from "express";
import mongoose from "mongoose";
import postRoutes from "./src/routes/postRoutes";
import commentsRoutes from "./src/routes/commentsRoute";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/authRoutes";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import initializePassport from "./src/passport"; // Import the initializePassport function
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Application = express();
dotenv.config();

// Initialize Passport
initializePassport(); // Set up the Google OAuth strategy

app.use(passport.initialize());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // TODO REPLACE WITH COLMAN IP
    credentials: true,
  })
);

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

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/comments", commentsRoutes);
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);

// MongoDB connection
if (!process.env.DB_CONNECT) {
  throw new Error("DB_CONNECT environment variable is not defined");
}

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("Connected to the database"))
  .catch((err: Error) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
