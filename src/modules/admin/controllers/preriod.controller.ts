import { Request, Response } from "express";
import {
  Course as CourseRepo,
  Period as PeriodRepo,
  Teacher as TeacherRepo,
  Student as StudentRepo,
} from "../../../entities";
import { PeriodData } from "../../../types";

export const createPeriod = async (
  req: Request<
    {},
    {},
    {
      period: PeriodData & {
        teacherId: number;
        studentId: number;
        courseId: number;
      };
    }
  >,
  res: Response
): Promise<any> => {
  const { period } = req.body;

  try {
    const checkTeacher = await TeacherRepo.findOne({
      where: { id: period.teacherId },
    });
    if (!checkTeacher)
      return res
        .status(404)
        .json({ error: "No se encuentra el profesor asignado" });

    const checkstudent = await StudentRepo.findOne({
      where: { id: period.studentId },
    });
    if (!checkstudent)
      return res
        .status(404)
        .json({ error: "No se encuentra el estudiante asignado" });

    const checkCourse = await CourseRepo.findOne({
      where: { id: period.courseId },
    });
    if (!checkCourse)
      return res
        .status(404)
        .json({ error: "No se encuentra el curso asignado" });

    const newPeriod = PeriodRepo.create({
      name: period.name,
      observations: period.observations,
      teacher: checkTeacher!!,
      student: checkstudent!!,
      course: checkCourse!!,
      start_date_lap1: period.start_date_lap1,
      end_date_lap1: period.end_date_lap1,
      start_date_lap2: period.start_date_lap2,
      end_date_lap2: period.end_date_lap2,
      start_date_lap3: period.start_date_lap3,
      end_date_lap3: period.end_date_lap3,
    });

    res.status(201).json({ msg: "Periodo creado" });
  } catch (error) {
    res.status(400).json({ error: "error creando curso" });
    console.log("error creating period =>> ", error);
  }
};
