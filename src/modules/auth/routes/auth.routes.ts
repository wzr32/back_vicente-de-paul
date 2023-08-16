import { Request, Response, Router } from "express";
import { loginUser, createUser, updateUser, deleteUser } from "../controllers";

const router = Router();

router
  .get("/", (req: Request, res: Response) => res.json({ msg: "on auth" }))
  .post("/login", loginUser)
  .post("/create-user", createUser)
  .put("/update-user/:id", updateUser)
  .delete("/delete-user/:id", deleteUser);

export default router;
