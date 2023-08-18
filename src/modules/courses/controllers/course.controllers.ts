import { Request, Response } from "express";
import { Course as CourseRepo, User as UserRepo } from "../../../entities";
import { CourseData } from "../../../types";

export const getAllCourses = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const courses = await CourseRepo.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo materias" });
    console.log("error getting courses =>> ", error);
  }
};

export const createCourse = async (
  req: Request<{}, {}, { course: Omit<CourseData, "id"> }>,
  res: Response
): Promise<any> => {
  const { course } = req.body;

  try {
    const checkCourse = await CourseRepo.findOne({
      where: { name: course.name },
    });
    if (checkCourse) {
      return res
        .status(409)
        .json({ error: "Ya existe una materia con este nombre" });
    }

    const newCourse = CourseRepo.create({
      name: course.name,
    });

    await CourseRepo.save(newCourse);

    res.status(201).json({ msg: "Materia creado!" });
  } catch (error) {
    res.status(400).json({ error: "error creando materia" });
    console.log("error creating course =>> ", error);
  }
};

export const updateCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const course = await CourseRepo.findOne({ where: { id: Number(id) } });
    if (!course) {
      return res.status(404).json({ error: "Materia no encontrada" });
    }

    const updatedCourse = {
      name,
    };

    await CourseRepo.update({ id: Number(id) }, updatedCourse);
    res.status(200).json({ msg: "Materia actualizada" });
  } catch (error) {
    res.status(400).json({ error: "Error actualizando materia" });
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const course = await CourseRepo.findOne({ where: { id: Number(id) } });
    if (!course) {
      return res.status(404).json({ error: "Materia no encontrada" });
    }
    await CourseRepo.delete({ id: Number(id) });
    res.status(200).json({ msg: "Materia eliminada" });
  } catch (error) {
    res.status(400).json({ error: "Error borrando materia" });
  }
};
