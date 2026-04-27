import express, { Application } from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

const app: Application = express();

// auth, users
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

export default app;