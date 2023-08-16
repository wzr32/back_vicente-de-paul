import { Router } from "express";
import {
  createStudent,
  createTeacher,
  getAllStudents,
  getAllTeachers,
  getStudent,
  getTeacher,
  getAllUsers,
  createCourse,
  getAllCourses,
} from "../controllers";

const router = Router();

router
  .get("/", (_, res) => {
    res.status(200).json({ msg: "admin router working!" });
  })
  .get("/get-student/:id", getStudent)
  .get("/get-students", getAllStudents)
  .get("/get-teacher/:id", getTeacher)
  .get("/get-teachers", getAllTeachers)
  .get("/get-users", getAllUsers)
  .get("/get-courses", getAllCourses)
  .post("/create-student", createStudent)
  .post("/create-teacher", createTeacher)
  .post("/create-course", createCourse);

export default router;
