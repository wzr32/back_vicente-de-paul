import { Request, Response } from "express";
import { User } from "../../../entities";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../../config";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      relations: ["roleId"],
    });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar password
    if (user && user.password !== password) {
      res.status(401).json({ error: "Contraseña inválida" });
    }

    const userData = jwt.sign(
      {
        id: user?.id,
        role: user?.roleId.id,
      },
      SECRET_KEY,
      {
        expiresIn: 1000 * 60 * 30,
      }
    );

    // Retornar datos del usuario
    res.status(200).json({ access_token: userData });
  } catch (error) {
    console.log(error);
  }
};
