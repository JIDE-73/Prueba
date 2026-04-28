import express, { Application } from "express";
import {
  createCourse,
  getCourses,
  getCourseSearch,
} from "../controllers/course";
import { verify } from "../middleware/jwt";

const app: Application = express();

app.post("/create", verify, createCourse);
app.get("/get-all", verify, getCourses);
app.get("/search/:search", verify, getCourseSearch);

export default app;