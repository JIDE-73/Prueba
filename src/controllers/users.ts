import bcryptjs from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/prismaClient";
import { validationResult, check } from "express-validator";
import { User, Person } from "../types";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, image } = req.body as User;
  const { name, phone, email, work_hours, institution, role } =
    req.body as Person;

  await check("name").notEmpty().withMessage("Name es requerido").run(req);
  await check("phone").notEmpty().withMessage("Phone es requerido").run(req);
  await check("email").notEmpty().withMessage("Email es requerido").run(req);
  await check("work_hours").notEmpty().withMessage("Work hours es requerido").run(req);
  await check("institution").notEmpty().withMessage("Institution es requerido").run(req);
  await check("role").notEmpty().withMessage("Role es requerido").run(req);
  await check("username").notEmpty().withMessage("Username es requerido").run(req);
  await check("password").notEmpty().withMessage("Password es requerido").run(req);
  await check("image").notEmpty().withMessage("Image es requerido").run(req);

  const er = validationResult(req);

  if (!er.isEmpty()) {
    return res.status(400).json({ errors: er.array() });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        image,
      },
    });

    await prisma.person.create({
      data: {
        userId: user.id,
        name,
        phone,
        email,
        work_hours: JSON.stringify(work_hours),
        institution,
        role,
      },
    });

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error interno del servidor", error: e });
  }
};

const getUsersRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const role = req.params.role as string;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = 10;

    await check("role").notEmpty().withMessage("Role es requerido").run(req);

    const er = validationResult(req);

    if (
      !er.isEmpty() ||
      !["Estudiante", "Tutor", "Administrador"].includes(role)
    ) {
      return res.status(400).json({ message: "Role invalido" });
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.person.findMany({
        where: {
          role: role as any,
        },
        skip,
        take: limit,
      }),
      prisma.person.count({
        where: {
          role: role as any,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "Usuarios obtenidos correctamente",
      data: users,
      pagination: {
        page,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error interno del servidor", error: e });
  }
};

const getStudentsCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courseId = req.params.courseId as string;

    await check("courseId")
      .notEmpty()
      .withMessage("Course ID es requerido")
      .run(req);

    const er = validationResult(req);

    if (!er.isEmpty()) {
      return res.status(400).json({ message: "Course ID invalido" });
    }

    const students = await prisma.course.findFirst({
      where: { id: Number(courseId) },
      include: {
        place: true,
        tutor: true,
        session: true,
        participants: true,
      },
    });
    res
      .status(200)
      .json({ message: "Estudiantes obtenidos correctamente", data: students });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error interno del servidor", error: e });
  }
};

export { createUser, getUsersRole, getStudentsCourse };
