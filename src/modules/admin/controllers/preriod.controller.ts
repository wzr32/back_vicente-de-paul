import { Request, Response } from "express";
import {
  Period as PeriodRepo,
  Section as SectionRepo,
} from "../../../entities";

export const createPeriod = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { period } = req.body;

  try {
    const checkSection = await SectionRepo.findOneBy({ id: period.section });
    if (!checkSection) {
      res.status(404).json({ error: "No se encuentra la seccion asignada" });
      return;
    }

    const checkPeriod = await PeriodRepo.findOneBy({ name: period.name });

    if (checkPeriod) {
      res.status(409).json({ error: "Nombre de periodo ya en uso." });
      return;
    }

    const newPeriod = PeriodRepo.create({
      name: period.name,
      observations: period.observations,
      section: checkSection,
    });

    await PeriodRepo.insert(newPeriod);
    res.status(201).json({ msg: "Periodo creado" });
  } catch (error) {
    res.status(400).json({ error: "error creando periodo" });
    console.log("error creating period =>> ", error);
  }
};

export const deletePeriod = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const checkPeriod = PeriodRepo.findOneBy({ id: Number(id) });

    if (!checkPeriod) {
      res.status(404).json({ error: "Periodo no encontrado" });
      return;
    }

    await PeriodRepo.delete({ id: Number(id) });
    res.status(200).json({ msg: "Periodo eliminado" });
  } catch (error) {
    res.status(400).json({ error: "Error eliminando periodo" });
    console.log("error deleting period =>> ", error);
  }
};
