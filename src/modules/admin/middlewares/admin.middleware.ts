import { NextFunction, Response, Request } from "express";
import { User } from "../../../entities";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../../config";

export const adminMiddleware = async (
  req: Request,
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
    return;
  }

  const user = await User.findOne({
    where: { id: decoded.id },
    relations: ["role"],
  });

  if (Number(user?.role.id) === 1) {
    next();
  } else {
    res.status(403).send("Usuario no autorizado");
    return;
  }
};
