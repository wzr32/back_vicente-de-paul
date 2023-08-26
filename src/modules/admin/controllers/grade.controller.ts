import { Request, Response } from "express";
import { Grade as GradeRepo } from "../../../entities";
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
        updatedGrades.push(grade);
      }
    }

    await GradeRepo.save(updatedGrades);
    res.status(200).json({ msg: "Notas Actualizadas!" });
  } catch (error) {
    res.status(400).json({ error: "Error actualizando notas" });
    console.log("error updating grades =>> ", error);
  }
};
