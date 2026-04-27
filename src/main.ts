import express, { Application } from "express";
import authRoutes from "./routes/auth";

const app: Application = express();

// auth, users
app.use("/auth", authRoutes);


export default app;