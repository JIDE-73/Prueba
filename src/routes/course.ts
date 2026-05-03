import express, { Application } from "express";
import {
  createCourse,
  getCourses,
  getCourseSearch,
  addToCourse,
} from "../controllers/course";
import { verify } from "../middleware/jwt";

const app: Application = express();

app.post("/create", verify, createCourse);
app.get("/get-all", verify, getCourses);
app.get("/search/:search", verify, getCourseSearch);
app.post("/add-to-course", verify, addToCourse);

export default app;