import { z } from "zod";

export const studentSchema = z.object({
  birthCountry: z.string().nonempty().trim(),
  birthdate: z.string().nonempty().trim(),
  dni: z.string().nonempty().trim(),
  firstName: z.string().nonempty().trim(),
  middleName: z.string().trim(),
  firstLastName: z.string().nonempty().trim(),
  secondLastName: z.string().trim(),
});

export const representantSchema = z.object({
  email: z.string().nonempty().email().trim(),
  dni: z.string().nonempty().trim(),
  firstName: z.string().nonempty().trim(),
  middleName: z.string().trim(),
  firstLastName: z.string().nonempty().trim(),
  secondLastName: z.string().trim(),
});

export const teacherSchema = z.object({
  email: z.string().nonempty().email().trim(),
  dni: z.string().nonempty().trim(),
  firstName: z.string().nonempty().trim(),
  middleName: z.string().trim(),
  firstLastName: z.string().nonempty().trim(),
  secondLastName: z.string().trim(),
});

export const createStudentSchema = z.object({
  student: studentSchema,
  representant: representantSchema,
});

export const createTeacherSchema = z.object({
  teacher: teacherSchema,
});
