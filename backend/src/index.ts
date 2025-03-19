import { createServer } from "./server"; // adjust the path accordingly

const app = createServer();
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//   console.log("calling the init"); // Debug log

//   // Initialize Passport
//   initializePassport(); // This should call the function
//   app.use(passport.initialize());
//   app.use(cookieParser());

//   app.use(
//     cors({
//       origin: "*",
//     })
//   );

//   // Middleware to parse JSON bodies
//   app.use(express.json());
//   app.use(bodyParser.json());

//   // Routes
//   app.use("/auth", authRouter); // Routes that use Passport
//   app.use("/comments", commentsRouter);
//   app.use("/posts", postRoutes);

//   // MongoDB connection
//   try {
//     await mongoose.connect(process.env.DB_CONNECT as string);
//     console.log("Connected to the database");
//     console.log("hi");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     throw err; // Throw the error to handle it in tests or calling functions
//   }

//   return app;
// };

// // Start the server only when running this file directly
// if (require.main === module) {
//   const PORT = process.env.PORT || 3000;
//   initApp()
//     .then((app) =>
//       app.listen(PORT, () =>
//         console.log(`Server running on http://loclhost:${PORT}`)
//       )
//     )
//     .catch((err) => {
//       console.error("Failed to start the server:", err);
//       process.exit(1); // Exit with failure code
//     });
// }

// // Export initApp and explicitly call it when imported
// export default initApp;

// // Explicitly call initApp when this file is imported
// if (process.env.NODE_ENV === "test") {
//   const PORT = process.env.PORT || 3000;
//   initApp()
//     .then((app) =>
//       app.listen(PORT, () =>
//         console.log(`Server running on http://localhost:${PORT}`)
//       )
//     )
//     .catch((err) => {
//       console.error("Failed to start the server:", err);
//       process.exit(1); // Exit with failure code
//     });
// }
