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
import { AppDataSource } from "../../../database";

export const createPensum = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { pensum } = req.body;
  try {
    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const newPensumArray = [];

        for (const item of pensum) {
          const checkTeacher = await transactionalEntityManager.findOne(
            TeacherRepo,
            { where: { id: item.teacher_id } }
          );
          if (!checkTeacher)
            return res.status(404).json({
              error: `No se encuentra el profesor con ID ${item.teacher_id}`,
            });

          const checkStudent = await transactionalEntityManager.findOne(
            StudentRepo,
            { where: { id: item.student_id } }
          );
          if (!checkStudent)
            return res.status(404).json({
              error: `No se encuentra el estudiante con ID ${item.teacher_id}`,
            });

          const checkPeriod = await transactionalEntityManager.findOne(
            PeriodRepo,
            { where: { id: item.period_id } }
          );
          if (!checkPeriod)
            return res.status(404).json({
              error: `No se encuentra el periodo con ID ${item.teacher_id}`,
            });

          const checkSection = await transactionalEntityManager.findOne(
            SectionRepo,
            { where: { id: item.section_id } }
          );
          if (!checkSection)
            return res.status(404).json({
              error: `No se encuentra el seccion con ID ${item.teacher_id}`,
            });

          const checkCourse = await transactionalEntityManager.findOne(
            CourseRepo,
            { where: { id: item.course_id } }
          );
          if (!checkCourse)
            return res.status(404).json({
              error: `No se encuentra el curso con ID ${item.teacher_id}`,
            });

          const newPensum = PensumRepo.create({
            teacher: checkTeacher!!,
            student: checkStudent!!,
            period: checkPeriod!!,
            course: checkCourse!!,
            section: checkSection!!,
          });

          newPensumArray.push(newPensum);
        }

        const savedPensums = await transactionalEntityManager.save(
          newPensumArray
        );

        for (const savedPensum of savedPensums) {
          for (const student of [savedPensum.student]) {
            const newGrade = GradeRepo.create({
              pensum: savedPensum,
              student: student,
              course: savedPensum.course,
              // Asigna los valores de las notas si es necesario
            });
            await transactionalEntityManager.save(newGrade);
          }
        }
      }
    );

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
