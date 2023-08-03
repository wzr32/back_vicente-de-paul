import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.status(200).json({ msg: "student router working!" });
});

export default router;
