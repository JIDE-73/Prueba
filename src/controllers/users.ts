import bcryptjs from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/prismaClient";
import { validationResult, check } from "express-validator";
import { User } from "../types";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, image, personId } = req.body as User;

  await check("username")
    .notEmpty()
    .withMessage("Username es requerido")
    .run(req);
  await check("password")
    .notEmpty()
    .withMessage("Password es requerido")
    .run(req);
  await check("image").notEmpty().withMessage("Image es requerido").run(req);
  await check("personId")
    .notEmpty()
    .withMessage("PersonId es requerido")
    .run(req);

  const er = validationResult(req);

  if (!er.isEmpty()) {
    return res.status(400).json({ errors: er.array() });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        image,
        personId: Number(personId),
      },
    });

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error interno del servidor", error: e });
  }
};

export { createUser };
