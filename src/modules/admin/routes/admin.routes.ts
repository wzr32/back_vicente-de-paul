import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.status(200).json({ msg: "admin router working!" });
});

export default router;
