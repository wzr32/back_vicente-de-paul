import { Router } from "express";
import { AuthRoutes } from "../modules/auth/routes";
import { ReportsRoutes } from "../modules/reports/routes";
import { TeacherRoutes } from "../modules/teachers/routes";
import { StudentRoutes } from "../modules/students/routes";
import { AdminRoutes } from "../modules/admin/routes";
import { CourseRoutes } from "../modules/courses/routes";

const router = Router();

router
  .get("/", (_, res) => res.json({ msg: "api working" }))
  .use("/auth", AuthRoutes)
  .use("/admin", AdminRoutes)
  .use("/report", ReportsRoutes)
  .use("/student", StudentRoutes)
  .use("/teacher", TeacherRoutes)
  .use("/course", CourseRoutes);

export default router;
