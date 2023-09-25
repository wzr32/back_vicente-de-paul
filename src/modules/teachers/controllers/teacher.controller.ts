import { Request, Response } from "express";
import { Pensum as PensumRepo } from "../../../entities";

interface CustomRequest extends Request {
  teacher?: number;
}

export const getTeacherGroups = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const id = req.teacher;

  try {
    const allPensums = await PensumRepo.createQueryBuilder("pensum")
      .leftJoinAndSelect("pensum.student", "student")
      .leftJoinAndSelect("pensum.teacher", "teacher")
      .leftJoinAndSelect("pensum.course", "course")
      .leftJoinAndSelect("pensum.section", "section")
      .leftJoinAndSelect("pensum.period", "period")
      .leftJoinAndSelect("student.grades", "grades")
      .leftJoinAndSelect("grades.course", "gradeCourse")
      .where("pensum.teacher.id = :teacherId", { teacherId: id })
      .getMany();

    const allPensumsData: any[] = [];

    for (const pensum of allPensums) {
      const { student, teacher, ...restOfObj } = pensum;
      const key = `${id}-${restOfObj.period.id}-${restOfObj.section.id}`;

      const existingObject = allPensumsData.find((obj) => obj.key === key);

      if (existingObject) {
        existingObject.students.push(student);
      } else {
        allPensumsData.push({
          key,
          students: [student],
          ...restOfObj,
        });
      }
    }

    res.status(200).json(allPensumsData);
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
