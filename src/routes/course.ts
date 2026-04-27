import express, { Application } from "express";
import { createUser, getUsersRole, getCourse } from "../controllers/users";
import { verify } from "../middleware/jwt";

const app: Application = express();

app.post("/", verify, createUser);

export default app;