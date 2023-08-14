import { Request, Response } from "express";
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

    const role = await RoleRepo.findOne({ where: { role_name: "student" } });

    if (!role) res.status(500).json({ error: "Ocurrio un error" });

    const newUser = UserRepo.create({
      email: createdRepresentant!!.email,
      password: hashPass(createdRepresentant!!.dni),
      role: role!!,
    });

    await UserRepo.save(newUser);
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
): Promise<void> => {
  const { teacher } = req.body;

  try {
    const checkTeacher = await TeacherRepo.findOne({
      where: { dni: teacher.dni },
    });

    if (checkTeacher) res.status(409).json({ error: "Profesor ya existe" });

    const newTeacher = TeacherRepo.create({
      dni: teacher.dni,
      email: teacher.email,
      firstName: teacher.firstName,
      middleName: teacher.middleName,
      firstLastName: teacher.firstLastName,
      secondLastName: teacher.secondLastName,
    });

    const role = await RoleRepo.findOne({ where: { role_name: "teacher" } });

    if (!role) res.status(500).json({ error: "Ocurrio un error" });

    const newUser = UserRepo.create({
      email: newTeacher!!.email,
      password: hashPass(newTeacher!!.dni),
      role: role!!,
    });

    await TeacherRepo.save(newTeacher);
    await UserRepo.save(newUser);

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
