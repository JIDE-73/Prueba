import prisma from "../../prisma/prismaClient";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { Course } from "../types";

const createCourse = async (req: Request, res: Response) => {
  const { name, period, tutorId, place } = req.body as Course;

  await check("name").notEmpty().withMessage("Name es requerido").run(req);
  await check("period").notEmpty().withMessage("Period es requerido").run(req);
  await check("place")
    .notEmpty()
    .withMessage("Place es requerido")
    .run(req);
  await check("tutorId")
    .notEmpty()
    .withMessage("TutorId es requerido")
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await prisma.course.create({
      data: {
        place,
        tutorId,
        name,
        period,
      },
    });

    res.status(201).json({ message: "Curso creado correctamente" });
  } catch (e) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getCoursesPeriod = async (req: Request, res: Response) => {
  const { period } = req.params;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = 10;

  await check("period").notEmpty().withMessage("Period es requerido").run(req);
  await check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page debe ser un entero positivo")
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const skip = (page - 1) * limit;

  try {
    const [courses, total] = await Promise.all([
      await prisma.course.findMany({
        where: { period: period as string },
        skip,
        take: limit,
      }),
      await prisma.course.count({
        where: { period: period as string },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "Cursos obtenidos correctamente",
      data: {
        courses,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getCourses = async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = 10;

  await check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page debe ser un entero positivo")
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const skip = (page - 1) * limit;

  try {
    const [courses, total] = await Promise.all([
      await prisma.course.findMany({
        skip,
        take: limit,
      }),
      await prisma.course.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "Cursos obtenidos correctamente",
      data: {
        courses,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getCourseName = async (req: Request, res: Response) => {
  const name = req.params.name as string;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = 10;

  await check("name").notEmpty().withMessage("Name es requerido").run(req);
  await check("page").optional().isInt({ min: 1 }).withMessage("Page debe ser un entero positivo").run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const skip = (page - 1) * limit;

  try {
    const [courses, total] = await Promise.all([
      await prisma.course.findMany({
        where: { name: { contains: name, mode: "insensitive" } },
        skip,
        take: limit,
      }),
      await prisma.course.count({
        where: { name: { contains: name, mode: "insensitive" } },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "Cursos obtenidos correctamente",
      data: {
        courses,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export { createCourse, getCourses, getCoursesPeriod, getCourseName };
