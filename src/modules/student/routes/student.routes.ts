import { Router } from "express";
import {
  getStudentByDni,
  getStudentWithGrades,
  reportAllStudentsGrades,
} from "../controllers";

const router = Router();

router
  .get("/", (_, res) => {
    res.status(200).json({ msg: "student router working!" });
  })
  .get("/grades-report", reportAllStudentsGrades)
  .post("/get-with-grades", getStudentWithGrades)
  .post("/get-by-dni", getStudentByDni);

export default router;
