import { NextFunction, Response, Request } from "express";
import { User } from "../../../entities";
import * as jwt from "jsonwebtoken";

export async function checkIsAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Obtener JWT de headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).send("No token provided");
  }

  // Verificar firma y decodificar JWT
  const decoded = jwt.verify(token, "secretkey");

  // Obtener usuario del JWT
  const user = await User.findOne({ where: {} });

  // Verificar rol
  if (Number(user?.roleId.id) === 1) {
    return res.status(403).send("Unauthorized");
  }

  next();
}
