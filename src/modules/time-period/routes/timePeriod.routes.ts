import { Router } from "express";
import { getNewestPeriodTime } from "../controllers";

const router = Router();

router.get("/get-time-period", getNewestPeriodTime);

export default router;
