import { Router } from "express";

const router = Router();

router.get("/", (req, res) => res.json({ msg: "on report routes" }));

export default router;
