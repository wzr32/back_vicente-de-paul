import { Router } from "express";
import { getTeacherGroups } from "../controllers";

const router = Router();

router
  .get("/", (_, res) => {
    res.status(200).json({ msg: "teacher router working!" });
  })
  .get("/get-groups", getTeacherGroups);

export default router;
