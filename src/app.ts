import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { routes } from "./routes";

const app = express();

app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));
app.use(cors());

app.set("flushHeaders", true);
app.set("PORT", process.env.PORT || 3000);
app.use(express.json());

const data = {
  name: "ruben padilla",
  dni: "21437088",
  studentGrades: [
    {
      gradeId: 1,
      course: "matematica",
      period: "primer año",
      lap1: 10,
      lap2: 10,
      lap3: 10,
    },
  ],
};

app.use("/pdf", (_, res) =>
  res.render("student-grades-report_primary.ejs", data)
);
app.use("/api", routes);

export default app;
