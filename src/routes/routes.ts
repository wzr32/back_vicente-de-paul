import { Router } from "express";
import { AuthRoutes } from "../modules/auth/routes";
import { ReportsRoutes } from "../modules/reports/routes";
import { TeacherRoutes } from "../modules/teachers/routes";
import { AdminRoutes } from "../modules/admin/routes";
import { CourseRoutes } from "../modules/courses/routes";
import { TimePeriodRoutes } from "../modules/time-period/routes";
import { StudentRoutes } from "../modules/student/routes";
import { adminMiddleware } from "../modules/admin/middlewares";
import { teacherMiddleware } from "../modules/teachers/middlewares";

const router = Router();

router
  .get("/", (_, res) => res.json({ msg: "api working" }))
  .use("/auth", AuthRoutes)
  .use("/admin", adminMiddleware, AdminRoutes)
  .use("/report", ReportsRoutes)
  .use("/teacher", teacherMiddleware, TeacherRoutes)
  .use("/student", StudentRoutes)
  .use("/time-period", TimePeriodRoutes)
  .use("/course", CourseRoutes);

export default router;
