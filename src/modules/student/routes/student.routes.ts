import { Router } from "express";
import { getStudentByDni } from "../controllers/student.controller";

const router = Router();

router
  .get("/", (_, res) => {
    res.status(200).json({ msg: "student router working!" });
  })
  .post("/get-by-dni", getStudentByDni);

export default router;
