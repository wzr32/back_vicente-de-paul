import { Request, Response } from "express";
import {
  Role as RoleRepo,
  Teacher as TeacherRepo,
  User as UserRepo,
} from "../../../entities";
import jwt from "jsonwebtoken";

import { SECRET_KEY } from "../../../config";
import { checkPass, hashPass } from "../../../utilities/bcrypt.utility";

export const loginTeacherUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await UserRepo.findOne({
      where: { email },
      relations: ["role"],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar password
    if (user && !checkPass(password, user.password)) {
      return res.status(401).json({ error: "Contraseña inválida" });
    }

    if (user && user.role.role_name === "admin") {
      res.status(409).json({ error: "Usuario no es profesor" });
      return;
    }

    const teacher = await TeacherRepo.findOne({
      where: { email: user.email },
    });

    if (!teacher) {
      res.status(404).json({ error: "Profesor no encontrado" });
      return;
    }

    const userData = jwt.sign(
      {
        id: user?.id,
        role: user?.role.id,
        teacherID: teacher.id,
      },
      SECRET_KEY,
      {
        expiresIn: 1000 * 60 * 30,
      }
    );

    // Retornar datos del usuario
    res.status(200).json({
      access_token: userData,
      user: { email: user?.email, role: user?.role.id },
    });
  } catch (error) {
    res.status(404).json({ error: "Error iniciando sesion" });
  }
};

export const loginAdminUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await UserRepo.findOne({
      where: { email },
      relations: ["role"],
    });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    if (user && !checkPass(password, user.password)) {
      res.status(401).json({ error: "Contraseña inválida" });
      return;
    }

    if (user && user.role.role_name === "teacher") {
      res.status(409).json({ error: "Usuario no es administrativo" });
      return;
    }

    const userData = jwt.sign(
      {
        id: user?.id,
        role: user?.role.id,
      },
      SECRET_KEY,
      {
        expiresIn: 1000 * 60 * 30,
      }
    );

    res.status(200).json({
      access_token: userData,
      user: { email: user?.email, role: user?.role.id },
    });
  } catch (error) {
    res.status(404).json({ error: "Error iniciando sesion" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const checkUser = await UserRepo.findOne({ where: { email } });

    if (checkUser) {
      return res.status(409).json({ error: "Email ya en uso" });
    }

    const adminRole = await RoleRepo.findOne({ where: { role_name: "admin" } });

    if (!adminRole) {
      return res.status(404).json({ error: "Role de usuario no encontrado " });
    }

    const hashedPass = hashPass(password);

    const user = UserRepo.create({
      email,
      password: hashedPass,
      role: adminRole,
    });

    await UserRepo.insert(user);

    res.status(201).json({ msg: "Usuario creado!" });
  } catch (error) {
    res.status(404).json({ error: "Error creando usuario" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const checkUser = await UserRepo.findOne({ where: { id: Number(id) } });

    if (!checkUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const hashedPass = hashPass(password);

    const user = {
      password: hashedPass,
      role: checkUser.role,
    };

    await UserRepo.update({ id: Number(id) }, user);

    res.status(200).json({ msg: "Actualizacion realizada!" });
  } catch (error) {
    console.log("update user error => ", error);
    res.status(404).json({ error: "Error actualizando usuario" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const checkUser = await UserRepo.findOne({ where: { id: Number(id) } });

    if (!checkUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await UserRepo.delete({ id: Number(id) });

    res.status(200).json({ msg: "Usuario eliminado!" });
  } catch (error) {
    res.status(404).json({ error: "Error eliminando usuario" });
  }
};
