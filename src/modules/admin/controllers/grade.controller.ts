import { Request, Response } from "express";
import {
  Grade as GradeRepo,
  PrimaryEvaluationElement as PrimaryEvaluationElementRepo,
  Student as StudentRepo,
  Period as PeriodRepo,
} from "../../../entities";
import { GradeData } from "../../../types";

export const updateGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { students } = req.body;

  if (!Array.isArray(students) || students.length === 0) {
    res.status(400).json({ error: "Data proporcionada es invalida" });
    return;
  }

  try {
    const updatedGrades: GradeData[] = [];

    for (const student of students) {
      for (const grade of student.grades) {
        let existingGrade = await GradeRepo.findOne({
          where: { student: { id: student.id } },
        });

        if (!existingGrade) {
          existingGrade = new GradeRepo();
        }

        existingGrade.grade_lap1 = grade.grade_lap1;
        existingGrade.grade_lap2 = grade.grade_lap2;
        existingGrade.grade_lap3 = grade.grade_lap3;
        existingGrade.course = grade.course;

        updatedGrades.push(existingGrade);
      }
    }

    await GradeRepo.save(updatedGrades);
    res.status(200).json({ msg: "Notas Actualizadas!" });
  } catch (error) {
    res.status(400).json({ error: "Error actualizando notas" });
    console.log("error updating grades =>> ", error);
  }
};

export const createPrimaryReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { primary_report } = req.body;

  if (!Array.isArray(primary_report) || primary_report.length === 0) {
    res.status(400).json({ error: "Data proporcionada es invalida" });
    return;
  }

  try {
    const student = await StudentRepo.findOne({
      where: { id: primary_report[0].student },
    });

    if (!student) {
      res.status(400).json({ error: "Estudiante no encontrado" });
    }

    const period = await PeriodRepo.findOne({
      where: { id: primary_report[0].period },
    });

    if (!period) {
      res.status(400).json({ error: "Periodo no encontrado" });
    }

    await PrimaryEvaluationElementRepo.createQueryBuilder()
      .delete()
      .from(PrimaryEvaluationElementRepo)
      .where("student = :student", { student: student?.id })
      .execute();

    const primaryReport: any[] = [];

    for (const report of primary_report) {
      const reportElement = PrimaryEvaluationElementRepo.create({
        element: report.element,
        description: report.description,
        comments: report.comments,
        grade: report.grade,
        proyect_name: report.proyect_name,
        grade_string: report.grade_string,
        student: student as StudentRepo,
        period: period as PeriodRepo,
      });

      primaryReport.push(reportElement);
    }

    await PrimaryEvaluationElementRepo.save(primaryReport);
    res.status(200).json({ msg: "Reporte creado!" });
  } catch (error) {
    res.status(400).json({ error: "Error creando reporte" });
    console.log("error updating grades =>> ", error);
  }
};
