import { Request, Response } from "express";
import { Pensum as PensumRepo } from "../../../entities";

interface CustomRequest extends Request {
  user?: number;
}

export const getTeacherGroups = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const id = req.user;

  try {
    const pensumsIDS = await PensumRepo.createQueryBuilder("pensum")
      .select("pensum.teacher.id", "id")
      .groupBy("pensum.teacher.id")
      .where("pensum.teacher.id = :teacherId", { teacherId: id })
      .getRawMany();

    const allPensums = await PensumRepo.createQueryBuilder("pensum")
      .leftJoinAndSelect("pensum.student", "student")
      .leftJoinAndSelect("pensum.teacher", "teacher")
      .leftJoinAndSelect("pensum.course", "course")
      .leftJoinAndSelect("pensum.section", "section")
      .leftJoinAndSelect("pensum.period", "period")
      .leftJoinAndSelect("student.grades", "grades")
      .leftJoinAndSelect("grades.course", "gradeCourse")
      .getMany();

    const pensums = [];

    for (const data of pensumsIDS) {
      const mainObj = {
        ...allPensums.filter((pensum) => pensum.teacher.id === data.id)[0],
      };

      const students: any[] = [];
      const teachers: any[] = [];

      allPensums
        .filter((pensum) => pensum.teacher.id === data.id)
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
    res.status(400).json({ error: "Error obteniendo estudiante" });
    console.log("error getting student by dni", error);
  }
};

export const getUpdateStudentsGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo estudiante" });
    console.log("error getting student by dni", error);
  }
};
