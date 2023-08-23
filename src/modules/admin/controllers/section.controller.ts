import { Request, Response } from "express";
import {
  Period as PeriodRepo,
  Section as SectionRepo,
} from "../../../entities";
import { SectionData } from "../../../types";

export const createSection = async (
  req: Request<
    {},
    {},
    {
      section: SectionData;
    }
  >,
  res: Response
): Promise<any> => {
  const { section } = req.body;

  try {
    const checkSection = await SectionRepo.findOne({
      where: { name: section.name },
    });

    if (checkSection) {
      return res.status(406).json({ error: "Nombre de seccion ya en uso" });
    }

    const newSection = SectionRepo.create({
      name: section.name,
    });

    await SectionRepo.insert(newSection);
    res.status(201).json({ msg: "Seccion creada!" });
  } catch (error) {
    res.status(400).json({ error: "Error creando seccion" });
    console.log("error creating section =>> ", error);
  }
};

export const getAllSections = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sections = await SectionRepo.find();
    res.status(200).json(sections);
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo seccion" });
    console.log("error creating section =>> ", error);
  }
};

export const getAllPeriods = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const periods = await PeriodRepo.find({ relations: ["section"] });
    res.status(200).json(periods);
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo periodos" });
    console.log("error getting periods =>> ", error);
  }
};
