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
  createPensum,
  getAllPensums,
  getAllPeriods,
  updatePeriod,
  updatePensum,
} from "../controllers";
import {
  createSection,
  getAllSections,
} from "../controllers/section.controller";
import { updateGrades } from "../controllers/grade.controller";

const router = Router();

router
  .get("/get-student/:id", getStudent)
  .get("/get-students", getAllStudents)
  .get("/get-teacher/:id", getTeacher)
  .get("/get-teachers", getAllTeachers)
  .get("/get-users", getAllUsers)
  .get("/get-sections", getAllSections)
  .get("/get-periods", getAllPeriods)
  .get("/get-pensums", getAllPensums)
  .post("/create-student", createStudent)
  .post("/create-period", createPeriod)
  .post("/create-section", createSection)
  .post("/create-teacher", createTeacher)
  .post("/create-pensum", createPensum)
  .put("/update-grades", updateGrades)
  .put("/update-period", updatePeriod)
  .put("/update-pensum", updatePensum)
  .delete("/delete-period/:id", deletePeriod);

export default router;
