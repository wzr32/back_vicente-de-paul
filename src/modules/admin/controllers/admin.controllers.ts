import { Request, Response } from "express";
import { EntityNotFoundError } from "typeorm";
import {
  Course as CourseRepo,
  Pensum as PensumRepo,
  Period as PeriodRepo,
  Representant as RepresentantRepo,
  Role as RoleRepo,
  Student as StudentRepo,
  Teacher as TeacherRepo,
  User as UserRepo,
} from "../../../entities";
import {
  StudentData,
  RepresentantData,
  TeacherData,
  PensumData,
  PeriodData,
} from "../../../types";
import { hashPass } from "../../../utilities/bcrypt.utility";

// CREATE

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

    if (checkStudent)
      return res.status(409).json({ error: "Estudiante ya existe" });

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
        phone: representant.phone,
        optionalPhone: representant.optionalPhone,
      });

      await RepresentantRepo.insert(newRepresentant);
      createdRepresentant = newRepresentant;
    } else {
      createdRepresentant = checkRepresentant;
    }

    const newStudent = StudentRepo.create({
      address: student.address,
      birthdate: student.birthdate,
      dni: student.dni,
      firstName: student.firstName,
      firstLastName: student.firstLastName,
      middleName: student.middleName,
      secondLastName: student.secondLastName,
      representant: createdRepresentant!!,
    });

    await StudentRepo.insert(newStudent);
    res.status(201).json({ msg: "Estudiante creado!", student: newStudent });
  } catch (error) {
    res.status(400).json({ error: "error creando estudiante" });
    console.log("error creating student =>> ", error);
  }
};

export const createTeacher = async (
  req: Request<{}, {}, { teacher: TeacherData }>,
  res: Response
): Promise<any> => {
  const { teacher } = req.body;

  try {
    const checkTeacher = await TeacherRepo.findOne({
      where: { dni: teacher.dni },
    });

    if (checkTeacher)
      return res.status(409).json({ error: "Profesor ya existe" });

    const newTeacher = TeacherRepo.create({
      dni: teacher.dni,
      email: teacher.email,
      phone: teacher.phone,
      firstName: teacher.firstName,
      middleName: teacher.middleName,
      firstLastName: teacher.firstLastName,
      secondLastName: teacher.secondLastName,
    });

    const role = await RoleRepo.findOne({ where: { role_name: "teacher" } });

    if (!role) return res.status(500).json({ error: "Ocurrio un error" });

    const newUser = UserRepo.create({
      email: newTeacher!!.email,
      password: hashPass(newTeacher!!.dni),
      role: role!!,
    });

    await TeacherRepo.insert(newTeacher);
    await UserRepo.insert(newUser);

    res.status(201).json({ msg: "Profesor creado!", teacher: newTeacher });
  } catch (error) {
    res.status(400).json({ error: "error creando profesor" });
    console.log("error creating teacher =>> ", error);
  }
};
// READ

export const getStudent = async (
  req: Request<{}, {}, { id: number }>,
  res: Response
): Promise<any> => {
  const { id } = req.body;
  try {
    const student = await StudentRepo.findOne({
      where: { id },
      relations: ["representant"],
    });
    res.status(200).json(student);
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      res.status(404).json({ error: "Estudiante no existe" });
    }
    res.status(400).json({ error: "error obteniendo estudiante" });
    console.log("error getting student =>> ", error);
  }
};
export const getAllStudents = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const students = await StudentRepo.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo estudiantes" });
    console.log("error getting students =>> ", error);
  }
};

export const getTeacher = async (
  req: Request<{}, {}, { id: number }>,
  res: Response
): Promise<any> => {
  const { id } = req.body;
  try {
    const teacher = await TeacherRepo.findOneBy({ id });

    if (!teacher) {
      return res.status(404).json({ error: "Profesor no existe" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return res.status(404).json({ error: "Profesor no existe" });
    }
    res.status(400).json({ error: "Error obteniendo profesor" });
    console.log("error getting teacher =>> ", error);
  }
};
export const getAllTeachers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const teachers = await TeacherRepo.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo profesores" });
    console.log("error getting teachers =>> ", error);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserRepo.find({ relations: ["role"] });

    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    res.status(404).json({ error: "Error obteniendo usuarios" });
  }
};

// UPDATE

// DELETE
