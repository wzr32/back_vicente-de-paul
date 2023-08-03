import { Request, Response } from "express";
import { Representant, Student, User } from "../../../entities";

export const createStudentUser = async (adminUser: User, studentData: any) => {
  if (!adminUser) {
    throw new Error("Solo usuarios admin pueden crear cuentas");
  }

  // Crear representante
  const representant = new Representant();
  representant.dni = studentData.representantDni;
  representant.firstName = studentData.representantFirstName;
  representant.firstLastName = studentData.representantLastName;

  await representant.save();

  // Crear estudiante
  const student = new Student();
  student.dni = studentData.dni;
  student.firstName = studentData.firstName;
  student.firstLastName = studentData.lastName;
  student.representant = representant;

  // Crear usuario
  const user = new User();
  user.email = `${student.firstName}@email.com`;
  user.password = student.dni;

  await user.save();

  return user;
};
