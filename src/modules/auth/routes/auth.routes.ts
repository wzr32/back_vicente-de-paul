import { Request, Response, Router } from "express";
import { loginUser, createUser, updateUser, deleteUser } from "../controllers";

const router = Router();

router
  .get("/", (req: Request, res: Response) => res.json({ msg: "on auth" }))
  .post("/login", loginUser)
  .post("/create-user", createUser)
  .post("/update-user", updateUser)
  .post("/delete-user", deleteUser);

export default router;
