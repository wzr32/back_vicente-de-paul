import { Router } from "express";
import {
  getStudentByDni,
  getStudentWithGrades,
  reportAllStudentGrades,
} from "../controllers";

const router = Router();

router
  .get("/", (_, res) => {
    res.status(200).json({ msg: "student router working!" });
  })
  .post("/grades-report", reportAllStudentGrades)
  .post("/get-with-grades", getStudentWithGrades)
  .post("/get-by-dni", getStudentByDni);

export default router;
