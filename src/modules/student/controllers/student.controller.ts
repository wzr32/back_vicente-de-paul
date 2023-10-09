import { Request, Response } from "express";
import {
  PrimaryEvaluationElement as PrimaryEvaluationElementRepo,
  Student as StudentRepo,
  StudentPerformanceComment as StudentPerformanceCommentRepo,
  Pensum as PensumRepo,
  Teacher as TeacherRepo,
  PeriodTime as PeriodTimeRepo,
} from "../../../entities";
import puppeteer, { PDFOptions } from "puppeteer";
import PDFMerger from "pdf-merger-js";
import path from "path";
import ejs from "ejs";
import * as fs from "fs";

interface CustomRequest extends Request {
  teacher?: number;
}

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
      relations: ["activePeriod", "activeSection", "performanceComments"],
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
  const { dni, lap } = req.body;

  let browser: any;

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

    const checkPensum = await PensumRepo.find({
      where: {
        student: { id: student.id },
        period: { id: student.activePeriod?.id },
        section: { id: student.activeSection?.id },
      },
      relations: ["teacher"],
    });

    if (!checkPensum) {
      res.status(404).json({ error: "Pensum no encontrado" });
      return;
    }

    const reportData = await PrimaryEvaluationElementRepo.find({
      where: { student: { id: student.id } },
      relations: ["student", "period"],
    });

    if (reportData.length < 1) {
      res
        .status(400)
        .json({ error: "Estudiante aun no posee calificaciones asignadas" });
      return;
    }

    const periodTime = await PeriodTimeRepo.find({
      order: {
        start_date: "DESC",
      },
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
      grade_literal: reportData[0].grade_string,
      comments: reportData[0].comments,
      student,
      pensum: checkPensum[0],
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
      lapMoment: lap,
      periodTime: periodTime[0] ? periodTime[0].name : "",
      imageData: base64Image,
    };
    const templatePath = path.join(
      __dirname,
      "../templates",
      "student-grades-report_primary.ejs"
    );

    const templatePathPerformance = path.join(
      __dirname,
      "../templates",
      "student-grades-report_primary_performance.ejs"
    );

    var merger = new PDFMerger();

    // (async () => {
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
    });

    const pdfOptions: PDFOptions = {
      format: "legal",
      printBackground: true,
      landscape: true,
    };
    ///////////////////////////////////////////////////////////////
    const [page1] = await browser.pages();
    const html1 = await ejs.renderFile(templatePath, data);
    await page1.setContent(html1, { waitUntil: "domcontentloaded" });

    const pdfBuffer1 = await page1.pdf(pdfOptions);

    ///////////////////////////////////////////////////////////////
    const [page2] = await browser.pages();
    const html2 = await ejs.renderFile(templatePathPerformance, data);
    await page1.setContent(html2, { waitUntil: "domcontentloaded" });

    const pdfBuffer2 = await page2.pdf(pdfOptions);

    await merger.add(pdfBuffer1);
    await merger.add(pdfBuffer2);

    const combinedPDF = await merger.saveAsBuffer();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
    res.status(200).send(combinedPDF);
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo data del estudiante" });
    console.log("error getting student data", error);
  } finally {
    browser?.close();
  }
};

export const reportAllStudentGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { dni, lap } = req.body;

  if (dni === undefined || dni === null) {
    res.status(400).json({ error: "Faltan datos en la peticion" });
    return;
  }

  let browser: any;

  try {
    const student = await StudentRepo.findOne({
      where: {
        dni,
      },
      relations: [
        "activePeriod",
        "activeSection",
        "grades",
        "grades.pensum",
        "grades.pensum.period",
        "grades.course",
        "grades.course.teachers",
        "performanceComments",
      ],
    });

    if (!student) {
      res.status(404).json({ error: "Estudiante no encontrado" });
      return;
    }

    // const guideTeacher = await GroupGuide.findOne({
    //   where: { section: { id: student.activeSection?.id } },
    //   relations: ["teacher"],
    // });

    const periodTime = await PeriodTimeRepo.find({
      order: {
        start_date: "DESC",
      },
    });

    if (periodTime.length < 1) {
      res.status(400).json({ error: "No hay periodo creado" });
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
      periodSection: `${
        student.activePeriod?.name
      } "${student.activeSection?.name.toUpperCase()}"`,
      educationType: student.activePeriod?.educationType,
      studentGrades,
      performanceComments: student.performanceComments[0],
      // guideTeacher: guideTeacher?.teacher,
      lapMoment: lap,
      periodTime: periodTime[0] ? periodTime[0].name : "",
      imageData: base64Image,
    };

    const templatePath = path.join(
      __dirname,
      "../templates",
      "student-grades-report.ejs"
    );

    browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
    });
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
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo data del estudiante" });
    console.log("error getting student data", error);
  } finally {
    browser?.close();
  }
};

export const createLapsComments = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { student_id, lap1_comments, lap2_comments, lap3_comments } = req.body;

  try {
    const checkStudent = await StudentRepo.findOne({
      where: { id: student_id },
    });

    if (!checkStudent) {
      res.status(404).json({ error: "Estudiante no encontrado" });
      return;
    }

    const newPerformanceComments = StudentPerformanceCommentRepo.create({
      lap1Comment: lap1_comments,
      lap2Comment: lap2_comments,
      lap3Comment: lap3_comments,
      student: checkStudent,
    });

    await StudentPerformanceCommentRepo.save(newPerformanceComments);
    res.status(201).json({ msg: "Comentarios agregados" });
  } catch (error) {
    res.status(400).json({ error: "Error creando comentarios" });
    console.log("error creating laps comments", error);
  }
};

export const updateLapsComments = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { student_id, lap1_comments, lap2_comments, lap3_comments } = req.body;

  try {
    const checkStudent = await StudentRepo.findOne({
      where: { id: student_id },
    });

    if (!checkStudent) {
      res.status(404).json({ error: "Estudiante no encontrado" });
      return;
    }

    const checkComment = await StudentPerformanceCommentRepo.findOne({
      where: { student: { id: checkStudent.id } },
    });

    if (!checkComment) {
      // Si no existe un registro, crea uno nuevo
      const newPerformanceComments = new StudentPerformanceCommentRepo();
      newPerformanceComments.lap1Comment = lap1_comments;
      newPerformanceComments.lap2Comment = lap2_comments;
      newPerformanceComments.lap3Comment = lap3_comments;
      newPerformanceComments.student = checkStudent;

      await StudentPerformanceCommentRepo.save(newPerformanceComments);
    } else {
      // Si existe un registro, actualiza los comentarios
      checkComment.lap1Comment = lap1_comments;
      checkComment.lap2Comment = lap2_comments;
      checkComment.lap3Comment = lap3_comments;

      await StudentPerformanceCommentRepo.save(checkComment);
    }

    res.status(200).json({ msg: "Comentarios actualizados" });
  } catch (error) {
    res.status(400).json({ error: "Error actualizando comentarios" });
    console.log("error updating laps comments", error);
  }
};

export const reportPrimaryDataByStudent = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    if (id === undefined || id === null) {
      res.status(400).json({ error: "Faltan datos en la peticion" });
      return;
    }

    const student = await StudentRepo.findOne({
      where: {
        id: Number(id),
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

    res.status(200).json(reportData);
  } catch (error) {
    res.status(400).json({ error: "Error actualizando comentarios" });
    console.log("error updating laps comments", error);
  }
};
