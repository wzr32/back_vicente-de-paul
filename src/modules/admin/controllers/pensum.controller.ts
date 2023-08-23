import { Request, Response } from "express";
import { PensumData } from "../../../types";
import {
  Course as CourseRepo,
  Teacher as TeacherRepo,
  Student as StudentRepo,
  Period as PeriodRepo,
  Pensum as PensumRepo,
} from "../../../entities";

export const createPensum = async (
  req: Request<{}, {}, { pensum: PensumData }>,
  res: Response
): Promise<any> => {
  const { pensum } = req.body;

  try {
    const checkTeacher = await TeacherRepo.findOne({
      where: { id: pensum.teacher.id },
    });
    if (!checkTeacher)
      return res
        .status(404)
        .json({ error: "No se encuentra el profesor asignado" });

    const checkstudent = await StudentRepo.findOne({
      where: { id: pensum.student.id },
    });
    if (!checkstudent)
      return res
        .status(404)
        .json({ error: "No se encuentra el estudiante asignado" });

    const checkPeriod = await PeriodRepo.findOne({
      where: { id: pensum.period.id },
    });
    if (!checkPeriod)
      return res
        .status(404)
        .json({ error: "No se encuentra el periodo asignado" });

    const checkCourse = await CourseRepo.findOne({
      where: { id: pensum.course.id },
    });
    if (!checkCourse)
      return res
        .status(404)
        .json({ error: "No se encuentra el curso asignado" });

    const newPensum = PensumRepo.create({
      teacher: checkTeacher!!,
      student: checkstudent!!,
      period: checkPeriod!!,
      course: checkCourse!!,
    });

    await PensumRepo.save(newPensum);
    res.status(201).json({ msg: "Pensum creado!" });
  } catch (error) {
    res.status(400).json({ error: "error creando curso" });
    console.log("error creating pensum =>> ", error);
  }
};
