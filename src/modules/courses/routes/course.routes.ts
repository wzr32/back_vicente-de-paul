import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
} from "../controllers";

const router = Router();

router
  .get("/", (_, res) => {
    res.status(200).json({ msg: "courses router working!" });
  })
  .get("/get-all-courses", getAllCourses)
  .post("/create-course", createCourse)
  .put("/update-course/:id", updateCourse)
  .delete("/delete-course/:id", deleteCourse);

export default router;
