import { Request, Response } from "express";
import { Student as StudentRepo } from "../../../entities";

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

export const reportAllStudentsGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentId = 1;
    const student = await StudentRepo.findOne({
      where: { id: Number(studentId) },
      relations: [
        "grades",
        "grades.pensum",
        "grades.course",
        "grades.course.teachers",
      ],
    });

    if (!student) {
      res.status(404).json({ error: "Estudiante no encontrado" });
    }

    const studentGrades = student?.grades.map((grade) => ({
      gradeId: grade.id,
      course: grade.course.name,
      teacher: grade.course.teachers.map(
        (teacher) => teacher.firstName + " " + teacher.firstLastName
      ),
      pensum: grade.pensum.name,
      lap1: grade.grade_lap1,
      lap2: grade.grade_lap2,
      lap3: grade.grade_lap3,
    }));

    res.status(200).json(studentGrades);
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo data del estudiante" });
    console.log("error getting student data", error);
  }
};
