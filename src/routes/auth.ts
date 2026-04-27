import express, { Application } from "express";
import { login, logout } from "../controllers/auth";
import { verify } from "../middleware/jwt";

const app: Application = express();

app.post("/login", login);

app.post("/logout", verify, logout);

export default app;
