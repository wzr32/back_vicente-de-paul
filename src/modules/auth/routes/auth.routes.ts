import { Request, Response, Router } from "express";
import { loginUser } from "../controllers";

const router = Router();

router
  .get("/", (req: Request, res: Response) => res.json({ msg: "on auth" }))
  .post("/login", loginUser);

export default router;
