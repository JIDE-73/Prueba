import express, { Application } from "express";
import { createUser, getUsersRole, getStudentsCourse } from "../controllers/users";
import { verify } from "../middleware/jwt";

const app: Application = express();

app.post("/users", createUser);
app.get("/users/role/:role", verify, getUsersRole);
app.get("/users/courses/:courseId", verify, getStudentsCourse);

export default app;