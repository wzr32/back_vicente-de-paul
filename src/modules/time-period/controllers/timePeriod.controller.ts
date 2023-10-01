import { Request, Response } from "express";
import { PeriodTime as PeriodTimeRepo } from "../../../entities";

export const CreatePeriodTime = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, start_date, end_date } = req.body;

  try {
    const checkPeriodTime = await PeriodTimeRepo.findOne({
      where: { name, start_date, end_date },
    });

    if (checkPeriodTime) {
      res.status(400).json({ error: "Periodo ya existe" });
      return;
    }

    const newPeriod = PeriodTimeRepo.create({
      name,
      start_date,
      end_date,
    });

    await PeriodTimeRepo.insert(newPeriod);
    res.status(201).json({ msg: "Periodo creado!" });
  } catch (err) {
    res.status(400).json({ error: "Error creando el periodo" });
    console.log("error creating period time =>> ", err);
  }
};

export const getNewestPeriodTime = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const periodTime = await PeriodTimeRepo.find({
      order: {
        start_date: "DESC",
      },
    });

    res.status(200).json(periodTime[0]);
  } catch (error) {
    res.status(400).json({ error: "Error obteniedno el periodo" });
    console.log("error creating period time =>> ", error);
  }
};
