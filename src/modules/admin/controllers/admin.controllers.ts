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
  CourseData,
  PensumData,
  PeriodData,
} from "../../students/types";
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

    console.log("checkStudent =>> ", checkStudent);

    if (checkStudent)
      return res.status(409).json({ error: "Estudiante ya existe" });
    console.log("after check student");

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

      await RepresentantRepo.insert(newRepresentant);
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

export const createCourse = async (
  req: Request<{}, {}, { course: Omit<CourseData, "id"> }>,
  res: Response
): Promise<void> => {
  const { course } = req.body;

  try {
    const checkCourse = await CourseRepo.findOne({
      where: { name: course.name },
    });
    if (checkCourse)
      res.status(409).json({ msg: "Ya existe un curso con este nombre" });

    const newCourse = CourseRepo.create({
      name: course.name,
    });

    await CourseRepo.save(newCourse);

    res.status(201).json({ msg: "Curso creado!" });
  } catch (error) {
    res.status(400).json({ error: "error creando curso" });
    console.log("error creating course =>> ", error);
  }
};

export const createPensum = async (
  req: Request<{}, {}, { pensum: PensumData }>,
  res: Response
): Promise<void> => {
  const { pensum } = req.body;

  try {
    const checkTeacher = await TeacherRepo.findOne({
      where: { id: pensum.teacherId },
    });
    if (!checkTeacher)
      res.status(404).json({ error: "No se encuentra el profesor asignado" });

    const checkstudent = await TeacherRepo.findOne({
      where: { id: pensum.studentId },
    });
    if (!checkstudent)
      res.status(404).json({ error: "No se encuentra el estudiante asignado" });

    const checkPeriod = await TeacherRepo.findOne({
      where: { id: pensum.periodId },
    });
    if (!checkPeriod)
      res.status(404).json({ error: "No se encuentra el periodo asignado" });

    const checkCourse = await TeacherRepo.findOne({
      where: { id: pensum.courseId },
    });
    if (!checkCourse)
      res.status(404).json({ error: "No se encuentra el curso asignado" });

    const newPensum = PensumRepo.create({
      teacherId: checkTeacher?.id,
      studentId: checkstudent?.id,
      periodId: checkPeriod?.id,
      courseId: checkCourse?.id,
      teacher: checkTeacher!!,
      student: checkstudent!!,
      period: checkPeriod!!,
      course: checkCourse!!,
    });

    await PensumRepo.save(newPensum);
    res.status(201).json({ msg: "Pensum creado!" });
  } catch (error) {
    res.status(400).json({ error: "error creando curso" });
    console.log("error creating pensum =>> ", error);
  }
};

export const createPeriod = async (
  req: Request<{}, {}, { period: PeriodData }>,
  res: Response
): Promise<void> => {
  const { period } = req.body;

  try {
    const checkTeacher = await TeacherRepo.findOne({
      where: { id: period.teacherId },
    });
    if (!checkTeacher)
      res.status(404).json({ error: "No se encuentra el profesor asignado" });

    const checkstudent = await TeacherRepo.findOne({
      where: { id: period.studentId },
    });
    if (!checkstudent)
      res.status(404).json({ error: "No se encuentra el estudiante asignado" });

    const checkCourse = await TeacherRepo.findOne({
      where: { id: period.courseId },
    });
    if (!checkCourse)
      res.status(404).json({ error: "No se encuentra el curso asignado" });

    const newPeriod = PeriodRepo.create({
      name: period.name,
      observations: period.observations,
      teacherId: checkTeacher?.id,
      studentId: checkstudent?.id,
      courseId: checkCourse?.id,
      teacher: checkTeacher!!,
      student: checkstudent!!,
      course: checkCourse!!,
    });
  } catch (error) {
    res.status(400).json({ error: "error creando curso" });
    console.log("error creating period =>> ", error);
  }
};

// READ

export const getStudent = async (
  req: Request<{}, {}, { id: number }>,
  res: Response
): Promise<any> => {
  const { id } = req.body;
  try {
    const student = await StudentRepo.findOneBy({ id });
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
    res.status(200).json(teacher);
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      res.status(404).json({ error: "Profesor no existe" });
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

export const getAllCourses = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const courses = await CourseRepo.find();
    res.status(200).json({ courses });
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo materias" });
    console.log("error getting courses =>> ", error);
  }
};
