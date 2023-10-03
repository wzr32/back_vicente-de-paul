import { Router } from "express";
import {
  createStudent,
  createTeacher,
  getAllStudents,
  getAllPrimaryStudents,
  getAllSecondaryStudents,
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
import {
  createLapsComments,
  reportAllStudentGrades,
  reportAllStudentPrimaryGrades,
  updateLapsComments,
} from "../../student/controllers";
import { CreatePeriodTime } from "../../time-period/controllers";

const router = Router();

router
  .get("/get-student/:id", getStudent)
  .get("/get-primary-students", getAllPrimaryStudents) //
  .get("/get-secondary-students", getAllSecondaryStudents) //
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
  .post("/create-time-period", CreatePeriodTime)
  .post("/grades-report", reportAllStudentGrades)
  .post("/primary-grades-report", reportAllStudentPrimaryGrades)
  .post("/create-laps-comments", createLapsComments)
  .put("/update-laps-comments", updateLapsComments)
  .put("/update-period", updatePeriod)
  .put("/update-pensum", updatePensum)
  .delete("/delete-period/:id", deletePeriod);

export default router;
