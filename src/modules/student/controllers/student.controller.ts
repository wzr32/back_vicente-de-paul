import { Request, Response } from "express";
import { Student as StudentRepo } from "../../../entities";
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
