import { NextFunction, Request, Response } from "express";
import { User as UserRepo } from "../../../entities";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../../config";

interface CustomRequest extends Request {
  teacher?: number;
}

export const teacherMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res
      .status(403)
      .json({ error: "Acceso no autorizado. Token no proporcionado." });
    return;
  }

  const decoded: any = jwt.verify(token, SECRET_KEY);
  const tokenExpired = decoded.exp <= Math.floor(Date.now() / 1000);

  if (tokenExpired) {
    res.status(401).json({ error: "Acceso no autorizado. Token inválido." });
  }

  const user = await UserRepo.findOne({
    where: { id: decoded.id },
    relations: ["role"],
  });

  if (Number(user?.role.id) === 2) {
    req.teacher = decoded.teacherID;
    next();
  } else {
    res.status(403).send("Usuario no autorizado");
    return;
  }
};
