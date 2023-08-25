import { Request, Response } from "express";
import {
  Course as CourseRepo,
  Teacher as TeacherRepo,
  Student as StudentRepo,
  Period as PeriodRepo,
  Pensum as PensumRepo,
  Section as SectionRepo,
  Grade as GradeRepo,
} from "../../../entities";

export const createPensum = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { pensum } = req.body;
  try {
    const newPensumArray = [];

    for (const item of pensum) {
      const checkTeacher = await TeacherRepo.findOne({
        where: { id: item.teacher_id },
      });
      if (!checkTeacher)
        return res
          .status(404)
          .json({ error: "No se encuentra el profesor asignado" });

      const checkStudent = await StudentRepo.findOne({
        where: { id: item.student_id },
      });
      if (!checkStudent)
        return res
          .status(404)
          .json({ error: "No se encuentra el estudiante asignado" });

      const checkPeriod = await PeriodRepo.findOne({
        where: { id: item.period_id },
      });
      if (!checkPeriod)
        return res
          .status(404)
          .json({ error: "No se encuentra el periodo asignado" });

      const checkSection = await SectionRepo.findOne({
        where: { id: item.section_id },
      });
      if (!checkSection)
        return res
          .status(404)
          .json({ error: "No se encuentra el curso asignado" });

      const checkCourse = await CourseRepo.findOne({
        where: { id: item.course_id },
      });
      if (!checkCourse)
        return res
          .status(404)
          .json({ error: "No se encuentra el curso asignado" });

      const newPensum = PensumRepo.create({
        teacher: checkTeacher!!,
        student: checkStudent!!,
        period: checkPeriod!!,
        course: checkCourse!!,
        section: checkSection!!,
      });

      newPensumArray.push(newPensum);
    }

    await GradeRepo.save(newPensumArray);
    await PensumRepo.save(newPensumArray);
    res.status(201).json({ msg: "Pensum creado!" });
  } catch (error) {
    res.status(400).json({ error: "error creando curso" });
    console.log("error creating pensum =>> ", error);
  }
};

export const getAllPensums = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pensumsIDS = await PensumRepo.createQueryBuilder("pensum")
      .select("pensum.period.id", "id")
      .groupBy("pensum.period.id")
      .getRawMany();

    const allPensums = await PensumRepo.createQueryBuilder("pensum")
      .leftJoinAndSelect("pensum.student", "student")
      .leftJoinAndSelect("pensum.teacher", "teacher")
      .leftJoinAndSelect("pensum.course", "course")
      .leftJoinAndSelect("pensum.section", "section")
      .leftJoinAndSelect("pensum.period", "period")
      .getMany();

    const pensums = [];

    for (const data of pensumsIDS) {
      const mainObj = {
        ...allPensums.filter((pensum) => pensum.period.id === data.id)[0],
      };

      const students: any[] = [];
      const teachers: any[] = [];

      allPensums
        .filter((pensum) => pensum.period.id === data.id)
        .map((pensum) => {
          if (!students.some((item) => item.id === pensum.student.id)) {
            const student = pensum.student;
            students.push(student);
          }

          if (!teachers.some((item) => item.id === pensum.teacher.id)) {
            const teacher = pensum.teacher;
            teacher.courses = [pensum.course];
            teachers.push(teacher);
          }
        });

      Object.assign(mainObj, { students, teachers });
      const { student, teacher, ...restMainObj } = mainObj;

      pensums.push(restMainObj);
    }

    res.status(200).json(pensums);
  } catch (error) {
    res.status(400).json({ error: "error obteniendo cursos" });
    console.log("error creating pensum =>> ", error);
  }
};
