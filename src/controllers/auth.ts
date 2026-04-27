import prisma from "../../prisma/prismaClient";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { login } from "../types";

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body as login;

  await check("username").notEmpty().run(req);
  await check("password").notEmpty().run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const u = await prisma.user.findFirst({
      where: { username },
    });

    if (!u) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
        error: "Usuario o contraseña incorrectos",
      });
    }

    const isMatch = await bcrypt.compare(password, u.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
        error: "Usuario o contraseña incorrectos",
      });
    }

    const token = jwt.sign(
      {
        uId: u.id,
        username: u.username,
        email: u.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "32h" },
    );

    //log the token in the database
    await prisma.tokenLog.create({
      data: {
        usuario_id: u.id,
        token,
      },
    });

    // Responder sin incluir password
    const { password: _, ...usuarioSeguro } = u;

    return res.status(200).json({
      message: "Login exitoso",
      data: {
        token,
        usuario: usuarioSeguro,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    await prisma.tokenLog.update({
      where: { token: authHeader },
      data: { revocado: true },
    });

    return res.status(200).json({
      message: "Logout exitoso",
    });
  } catch (e) {
    res.status(500).json({ message: "Error al cerrar sesión" });
  }
};

export { login, logout };
