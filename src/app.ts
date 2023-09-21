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

// const data = {
//   name: "ruben padilla",
//   dni: "21437088",
//   studentGrades: [
//     {
//       gradeId: 1,
//       course: "matematica",
//       period: "primer año",
//       lap1: 10,
//       lap2: 10,
//       lap3: 10,
//     },
//   ],
// };

const student = {
  firstName: "ruben",
  middleName: "alejandro",
  firstLastName: "padilla",
  secondLastName: "rodriguez",
  activePeriod: {
    name: "5to",
  },
  activeSection: {
    name: "a",
  },
  representant: {
    firstName: "ruben",
    middleName: "alejandro",
    firstLastName: "padilla",
    secondLastName: "rodriguez",
  },
};

const data = {
  student,
  literature_opt_1: "i",
  literature_opt_2: "i",
  literature_opt_3: "i",
  literature_opt_4: "i",
  math_opt_1: "i",
  math_opt_2: "i",
  math_opt_3: "i",
  math_opt_4: "i",
  natTech_opt_1: "i",
  natTech_opt_2: "i",
  natTech_opt_3: "i",
  natTech_opt_4: "i",
  social_opt_1: "i",
  social_opt_2: "i",
  social_opt_3: "i",
  social_opt_4: "i",
  esthetic_opt_1: "i",
  esthetic_opt_2: "i",
  sport_opt_1: "i",
  sport_opt_2: "i",
  faith_opt_1: "i",
  faith_opt_2: "i",
  faith_opt_3: "i",
  english_opt_1: "i",
  english_opt_2: "i",
};

app.use("/pdf", (_, res) =>
  res.render("student-grades-report_primary.ejs", data)
);
app.use("/api", routes);

export default app;
