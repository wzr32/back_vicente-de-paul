import { Request, Response } from "express";
import {
  PrimaryEvaluationElement as PrimaryEvaluationElementRepo,
  Student as StudentRepo,
} from "../../../entities";
import puppeteer, { PDFOptions } from "puppeteer";
import path from "path";
import ejs from "ejs";
import * as fs from "fs";

export const getStudentWithGrades = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { dni } = req.body;
  try {
    const student = await StudentRepo.findOne({
      where: { dni },
      relations: ["grades", "grades.course"],
    });
    if (!student) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo estudiante" });
    console.log("error getting student", error);
  }
};

export const getStudentByDni = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { dni } = req.body;

  if (dni === undefined || dni === null) {
    res.status(400).json({ error: "Faltan datos en la peticion" });
    return;
  }

  try {
    const student = await StudentRepo.findOne({
      where: { dni },
      relations: ["activePeriod", "activeSection"],
    });
    if (!student) {
      res.status(404).json({ error: "Estudiante no encontrado" });
      return;
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo estudiante" });
    console.log("error getting student by dni", error);
  }
};

export const reportAllStudentPrimaryGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { dni } = req.body;

  try {
    if (dni === undefined || dni === null) {
      res.status(400).json({ error: "Faltan datos en la peticion" });
      return;
    }

    const student = await StudentRepo.findOne({
      where: {
        dni,
      },
      relations: ["representant", "activePeriod", "activeSection"],
    });

    if (!student) {
      res.status(404).json({ error: "Estudiante no encontrado" });
      return;
    }

    const reportData = await PrimaryEvaluationElementRepo.find({
      where: { student: { id: student.id } },
      relations: ["student", "period"],
    });

    const findObjectByDescription = (description: string) => {
      return reportData.find((item: any) => item.description === description);
    };

    const imagePath = path.join(
      __dirname,
      "../../../public",
      "san_vicente.png"
    );
    const image = fs.readFileSync(imagePath);
    const base64Image = Buffer.from(image).toString("base64");

    const data = {
      student,
      literature_opt_1: findObjectByDescription("literature_opt_1"),
      literature_opt_2: findObjectByDescription("literature_opt_2"),
      literature_opt_3: findObjectByDescription("literature_opt_3"),
      literature_opt_4: findObjectByDescription("literature_opt_4"),
      math_opt_1: findObjectByDescription("math_opt_1"),
      math_opt_2: findObjectByDescription("math_opt_2"),
      math_opt_3: findObjectByDescription("math_opt_3"),
      math_opt_4: findObjectByDescription("math_opt_4"),
      natTech_opt_1: findObjectByDescription("natTech_opt_1"),
      natTech_opt_2: findObjectByDescription("natTech_opt_2"),
      natTech_opt_3: findObjectByDescription("natTech_opt_3"),
      natTech_opt_4: findObjectByDescription("natTech_opt_4"),
      social_opt_1: findObjectByDescription("social_opt_1"),
      social_opt_2: findObjectByDescription("social_opt_2"),
      social_opt_3: findObjectByDescription("social_opt_3"),
      social_opt_4: findObjectByDescription("social_opt_4"),
      esthetic_opt_1: findObjectByDescription("esthetic_opt_1"),
      esthetic_opt_2: findObjectByDescription("esthetic_opt_2"),
      sport_opt_1: findObjectByDescription("sport_opt_1"),
      sport_opt_2: findObjectByDescription("sport_opt_2"),
      faith_opt_1: findObjectByDescription("faith_opt_1"),
      faith_opt_2: findObjectByDescription("faith_opt_2"),
      faith_opt_3: findObjectByDescription("faith_opt_3"),
      english_opt_1: findObjectByDescription("english_opt_1"),
      english_opt_2: findObjectByDescription("english_opt_2"),
      imageData: base64Image,
    };

    let browser: any;
    const templatePath = path.join(
      __dirname,
      "../templates",
      "student-grades-report_primary_performance.ejs"
    );

    (async () => {
      browser = await puppeteer.launch();
      const [page] = await browser.pages();
      const html = await ejs.renderFile(templatePath, data);
      await page.setContent(html, { waitUntil: "domcontentloaded" });

      const pdfOptions: PDFOptions = {
        format: "a4",
        printBackground: true,
      };

      const pdfBuffer = await page.pdf(pdfOptions);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
      res.status(200).send(pdfBuffer);
    })()
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      })
      .finally(() => browser?.close());
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo data del estudiante" });
    console.log("error getting student data", error);
  }
};

export const reportAllStudentGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { dni } = req.body;

  if (dni === undefined || dni === null) {
    res.status(400).json({ error: "Faltan datos en la peticion" });
    return;
  }

  try {
    const student = await StudentRepo.findOne({
      where: {
        dni,
      },
      relations: [
        "grades",
        "grades.pensum",
        "grades.pensum.period",
        "grades.course",
        "grades.course.teachers",
      ],
    });

    if (!student) {
      res.status(404).json({ error: "Estudiante no encontrado" });
      return;
    }

    const studentGrades = student?.grades.map((grade) => ({
      gradeId: grade.id,
      course: grade.course.name,
      teacher: grade.course.teachers.map(
        (teacher) => teacher.firstName + " " + teacher.firstLastName
      ),
      period: grade.pensum.period.name,
      lap1: grade.grade_lap1,
      lap2: grade.grade_lap2,
      lap3: grade.grade_lap3,
    }));

    const imagePath = path.join(
      __dirname,
      "../../../public",
      "san_vicente.png"
    );
    const image = fs.readFileSync(imagePath);
    const base64Image = Buffer.from(image).toString("base64");

    const data = {
      name: student?.firstName + " " + student?.firstLastName,
      dni: student?.dni,
      studentGrades,
      imageData: base64Image,
    };

    let browser: any;
    const templatePath = path.join(
      __dirname,
      "../templates",
      "student-grades-report.ejs"
    );

    (async () => {
      browser = await puppeteer.launch();
      const [page] = await browser.pages();
      const html = await ejs.renderFile(templatePath, data);
      await page.setContent(html, { waitUntil: "domcontentloaded" });

      const pdfOptions: PDFOptions = {
        format: "a4",
        printBackground: true,
      };

      const pdfBuffer = await page.pdf(pdfOptions);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
      res.status(200).send(pdfBuffer);
    })()
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      })
      .finally(() => browser?.close());
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo data del estudiante" });
    console.log("error getting student data", error);
  }
};
