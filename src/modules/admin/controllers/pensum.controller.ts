import { Request, Response } from "express";
import {
  Course as CourseRepo,
  Teacher as TeacherRepo,
  Student as StudentRepo,
  Period as PeriodRepo,
  Pensum as PensumRepo,
  Section as SectionRepo,
} from "../../../entities";

export const createPensum = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { pensum } = req.body;

  try {
    // const checkTeacher = await TeacherRepo.findOne({
    //   where: { id: pensum.teacher_id },
    // });
    // if (!checkTeacher)
    //   return res
    //     .status(404)
    //     .json({ error: "No se encuentra el profesor asignado" });

    // const checkstudent = await StudentRepo.findOne({
    //   where: { id: pensum.student_id },
    // });
    // if (!checkstudent)
    //   return res
    //     .status(404)
    //     .json({ error: "No se encuentra el estudiante asignado" });

    const checkPeriod = await PeriodRepo.findOne({
      where: { id: pensum.period_id },
    });
    if (!checkPeriod)
      return res
        .status(404)
        .json({ error: "No se encuentra el periodo asignado" });

    const checkSection = await SectionRepo.findOne({
      where: { id: pensum.section_id },
    });
    if (!checkSection)
      return res
        .status(404)
        .json({ error: "No se encuentra el curso asignado" });

    const checkCourse = await CourseRepo.findOne({
      where: { id: pensum.course_id },
    });
    if (!checkCourse)
      return res
        .status(404)
        .json({ error: "No se encuentra el curso asignado" });

    const newPensum = PensumRepo.create({
      name: `${checkPeriod.name} - ${checkSection.name}`,
      teachers: pensum.teachers,
      students: pensum.students,
      period: checkPeriod!!,
      course: checkCourse!!,
      section: checkSection!!,
    });

    await PensumRepo.save(newPensum);
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
    const pensums = await PensumRepo.find({
      relations: ["teachers", "students", "period", "course", "section"],
    });

    // const pensums = await PensumRepo.createQueryBuilder("pensum")
    //   .leftJoinAndSelect("pensum.student", "student")
    //   .leftJoinAndSelect("pensum.teacher", "teacher")
    //   .leftJoinAndSelect("pensum.course", "course")
    //   .getMany();

    // // Crear un arreglo para almacenar los detalles de estudiantes
    // const studentDetails = [];

    // // Iterar a través de los estudiantes del pensum
    // for (const pensumItem of pensum) {
    //   for (const student of pensumItem.students) {
    //     // Obtener las calificaciones correspondientes para el estudiante
    //     const grades = {
    //       grade_lap1: student.grade_lap1,
    //       grade_lap2: student.grade_lap2,
    //       grade_lap3: student.grade_lap3,
    //     };

    //     // Agregar los detalles del estudiante al arreglo
    //     studentDetails.push({
    //       student,
    //       grades,
    //     });
    //   }
    // }

    res.status(200).json(pensums);
  } catch (error) {
    res.status(400).json({ error: "error obteniendo cursos" });
    console.log("error creating pensum =>> ", error);
  }
};
