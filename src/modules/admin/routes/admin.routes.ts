import { Router } from "express";
import {
  createStudent,
  createTeacher,
  getAllStudents,
  getAllTeachers,
  getStudent,
  getTeacher,
  getAllUsers,
  createPeriod,
  deletePeriod,
} from "../controllers";
import {
  createSection,
  getAllPeriods,
  getAllSections,
} from "../controllers/section.controller";

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
  .get("/get-sections", getAllSections)
  .get("/get-periods", getAllPeriods)
  .post("/create-student", createStudent)
  .post("/create-period", createPeriod)
  .post("/create-section", createSection)
  .post("/create-teacher", createTeacher)
  .delete("/delete-period/:id", deletePeriod);

export default router;
