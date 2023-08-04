import { Request, Response } from "express";
import {
  Representant as RepresentantRepo,
  Student as StudentRepo,
} from "../../../entities";
import { StudentData, RepresentantData } from "../../students/types";

export const createStudent = async (
  req: Request<
    {},
    {},
    { student: StudentData; representant: RepresentantData }
  >,
  res: Response
): Promise<any> => {
  let createdRepresentant = null;
  const { student, representant } = req.body;

  try {
    const checkStudent = await StudentRepo.findOne({
      where: { dni: student.dni },
    });

    if (checkStudent) res.status(409).json({ error: "Estudiante ya existe" });

    const checkRepresentant = await RepresentantRepo.findOne({
      where: { dni: representant.dni },
    });

    if (!checkRepresentant) {
      const newRepresentant = RepresentantRepo.create({
        dni: representant.dni,
        email: representant.email,
        firstName: representant.firstName,
        middleName: representant.middleName,
        firstLastName: representant.firstLastName,
        secondLastName: representant.secondLastName,
      });

      await RepresentantRepo.save(newRepresentant);
      createdRepresentant = newRepresentant;
    } else {
      createdRepresentant = checkRepresentant;
    }

    const newStudent = StudentRepo.create({
      birthCountry: student.birthCountry,
      birthdate: student.birthdate,
      dni: student.dni,
      firstName: student.firstName,
      firstLastName: student.firstLastName,
      middleName: student.middleName,
      secondLastName: student.secondLastName,
      representant: createdRepresentant!!,
    });

    console.log("newStudent =>> ", newStudent);
    console.log("createdRepresentant =>> ", createdRepresentant);

    await StudentRepo.save(newStudent);
    res.status(201).json({ msg: "student created!", student: newStudent });
  } catch (error) {
    res.status(400).json({ error: "error creating student" });
    console.log("error creating student =>> ", error);
  }
};

export const createTeacher = (req: Request, res: Response): void => {};

export const createCourse = (req: Request, res: Response): void => {};

export const createPesum = (req: Request, res: Response): void => {};

export const createPeriod = (req: Request, res: Response): void => {};
