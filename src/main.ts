import express, { Application } from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";

const app: Application = express();

// auth, users
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

//courses
app.use("/courses", courseRoutes);

export default app;