import { Request, Response } from "express";
import {
  Period as PeriodRepo,
  Section as SectionRepo,
} from "../../../entities";

interface CreatePeriodWithSectionsRequest {
  period: {
    name: string;
    observations: string;
  };
  sections: {
    name: string;
  }[];
}

interface UpdatePeriodWithSectionsRequest {
  period: {
    id: number;
    name: string;
    observations: string;
  };
  sections: {
    id: number;
    name: string;
  }[];
}

export const getAllPeriods = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const periods = await PeriodRepo.find({ relations: ["sections"] });
    res.status(200).json(periods);
  } catch (error) {
    res.status(400).json({ error: "Error obteniendo periodos" });
    console.log("error getting periods =>> ", error);
  }
};

export const createPeriod = async (
  req: Request,
  res: Response
): Promise<any> => {
  const requestData: CreatePeriodWithSectionsRequest = req.body;
  const { period, sections } = requestData;

  try {
    const checkPeriod = await PeriodRepo.findOneBy({ name: period.name });

    if (checkPeriod) {
      res.status(409).json({ error: "Nombre de periodo ya en uso." });
      return;
    }

    const createdPeriod = await PeriodRepo.insert(period);

    const newSections = sections.map((section) => {
      const newSection = SectionRepo.create({
        ...section,
        period: createdPeriod.generatedMaps[0],
      });
      return newSection;
    });

    await SectionRepo.insert(newSections);

    res.status(201).json({ msg: "Periodo y secciones creadas" });
  } catch (error) {
    res.status(400).json({ error: "error creando periodo" });
    console.log("error creating period =>> ", error);
  }
};

export const updatePeriod = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requestData: UpdatePeriodWithSectionsRequest = req.body;
  const { period, sections } = requestData;
  console.log(period);
  console.log(sections);
  try {
    const checkPeriod = await PeriodRepo.findOne({
      where: { id: period.id },
    });

    if (!checkPeriod) {
      res.status(404).json({ error: "Periodo no encontrado" });
      return;
    }

    await PeriodRepo.update(period.id, period);

    for (const sectionData of sections) {
      const sectionId = sectionData.id;
      if (sectionId) {
        await SectionRepo.update(sectionId, sectionData);
      } else {
        const newSection = SectionRepo.create({
          ...sectionData,
          period: checkPeriod,
        });
        await SectionRepo.save(newSection);
      }
    }

    res.status(200).json({ msg: "Periodo actualizado" });
  } catch (error) {
    res.status(400).json({ error: "Error actualizando periodo" });
    console.log("error updating period =>> ", error);
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
