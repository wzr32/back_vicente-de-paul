import { Router } from "express";
import { createStudent } from "../controllers";

const router = Router();

router
  .get("/", (_, res) => {
    res.status(200).json({ msg: "admin router working!" });
  })
  .post("/create-student", createStudent);

export default router;
