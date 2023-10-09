import { Router } from "express";
import { getTeacherGroups } from "../controllers";
import {
  createPrimaryReport,
  updateGrades,
} from "../../admin/controllers/grade.controller";
import { reportPrimaryDataByStudent } from "../../student/controllers";

const router = Router();

router
  .get("/", (_, res) => {
    res.status(200).json({ msg: "teacher router working!" });
  })
  .get("/get-groups", getTeacherGroups)
  .get("/get-primary-report/:id", reportPrimaryDataByStudent)
  .post("/primary-grades", createPrimaryReport)
  .put("/update-grades", updateGrades);

export default router;
