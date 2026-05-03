import express, { Application } from "express";
import { createUser, getUsersRole, getCourse, getMyCourses } from "../controllers/users";
import { verify } from "../middleware/jwt";

const app: Application = express();

app.post("/create", createUser);
app.get("/get-by-role/:role", verify, getUsersRole);
app.get("/get-by-course/:courseId", verify, getCourse);
app.get("/get-my-courses/:personId", verify, getMyCourses);

export default app;