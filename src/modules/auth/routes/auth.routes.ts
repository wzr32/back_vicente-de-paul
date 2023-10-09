import { Request, Response, Router } from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  loginTeacherUser,
  loginAdminUser,
} from "../controllers";

const router = Router();

router
  .get("/", (req: Request, res: Response) => res.json({ msg: "on auth" }))
  .post("/login-admin", loginAdminUser)
  .post("/login-teacher", loginTeacherUser)
  .post("/create-user", createUser)
  .put("/update-user/:id", updateUser)
  .delete("/delete-user/:id", deleteUser);

export default router;
