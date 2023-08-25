import { Router } from "express";
import { getStudentWithGrades } from "../controllers";

const router = Router();

router
  .get("/", (_, res) => {
    res.status(200).json({ msg: "student router working!" });
  })
  .post("/get-with-grades", getStudentWithGrades);

export default router;
