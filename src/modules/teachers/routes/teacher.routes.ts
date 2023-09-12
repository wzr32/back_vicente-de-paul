import { Router } from "express";
import { getTeacherGroups } from "../controllers";
import { updateGrades } from "../../admin/controllers/grade.controller";

const router = Router();

router
  .get("/", (_, res) => {
    res.status(200).json({ msg: "teacher router working!" });
  })
  .get("/get-groups", getTeacherGroups)
  .put("/update-grades", updateGrades);

export default router;
