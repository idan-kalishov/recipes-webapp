import express, { Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import postRoutes from "./routes/postRoutes";
import commentsRouter from "./routes/commentsRoute";
import bodyParser from "body-parser";
import authRouter from "./routes/authRoutes";

const initApp = async (): Promise<Application> => {
  const app: Application = express();

  // Middleware to parse JSON bodies
  app.use(express.json());
  app.use(bodyParser.json());

  // Routes
  app.use("/auth", authRouter)
  app.use("/comments", commentsRouter);
  app.use("/posts", postRoutes);

  // MongoDB connection
  try {
    await mongoose.connect(process.env.DB_CONNECT as string);
    console.log("Connected to the database");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err; // Throw the error to handle it in tests or calling functions
  }

  return app;
};

// Start the server only when running this file directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  initApp()
      .then((app) =>
          app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
      )
      .catch((err) => {
        console.error("Failed to start the server:", err);
        process.exit(1); // Exit with failure code
      });
}

export default initApp;
