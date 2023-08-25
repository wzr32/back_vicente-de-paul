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
    console.log("error getting student by dni", error);
  }
};
