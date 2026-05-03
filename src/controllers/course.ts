import prisma from "../../prisma/prismaClient";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { Course, addToCourse } from "../types";
import { CourseStatus } from "../../generated/prisma/browser";

const createCourse = async (req: Request, res: Response) => {
  const {
    name,
    period,
    tutorId,
    place,
    date_init,
    date_end,
    hours_day,
    total_hours,
    status,
  } = req.body as Course;

  await check("name").notEmpty().withMessage("Name es requerido").run(req);
  await check("period").notEmpty().withMessage("Period es requerido").run(req);
  await check("place").notEmpty().withMessage("Place es requerido").run(req);
  await check("tutorId")
    .notEmpty()
    .withMessage("TutorId es requerido")
    .run(req);
  await check("date_init")
    .notEmpty()
    .withMessage("Date init es requerido")
    .run(req);
  await check("date_end")
    .notEmpty()
    .withMessage("Date end es requerido")
    .run(req);
  await check("hours_day")
    .notEmpty()
    .withMessage("Hours day es requerido")
    .run(req);
  await check("total_hours")
    .notEmpty()
    .withMessage("Total hours es requerido")
    .run(req);
  await check("status").notEmpty().withMessage("Status es requerido").run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const tutor = await prisma.person.findFirst({
      where: { id: tutorId, role: "Tutor" },
    });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor no encontrado" });
    }

    await prisma.course.create({
      data: {
        place,
        tutorId: Number(tutorId),
        name,
        period,
        date_init,
        date_end,
        hours_day,
        total_hours,
        status: status as CourseStatus,
      },
    });

    res.status(201).json({ message: "Curso creado correctamente" });
  } catch (e) {
    console.log("error", e);
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

const getCourseSearch = async (req: Request, res: Response) => {
  const search = req.params.search as string;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = 10;

  await check("search").notEmpty().withMessage("Search es requerido").run(req);
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
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { place: { contains: search, mode: "insensitive" } },
            { period: { contains: search, mode: "insensitive" } },
          ],
        },
        skip,
        take: limit,
      }),
      await prisma.course.count({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { place: { contains: search, mode: "insensitive" } },
            { period: { contains: search, mode: "insensitive" } },
          ],
        },
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

const addToCourse = async (req: Request, res: Response) => {
  const { personId, courseId, tutorId } = req.body as addToCourse;

  await check("personId")
    .notEmpty()
    .withMessage("PersonId es requerido")
    .run(req);
  await check("courseId")
    .notEmpty()
    .withMessage("CourseId es requerido")
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
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { participants: true, tutor: true }, // Incluir para verificar duplicados
    });
    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Verificar que personId sea un estudiante existente
    const student = await prisma.person.findUnique({
      where: { id: personId },
    });
    if (!student || student.role !== "Estudiante") {
      return res
        .status(404)
        .json({ message: "Estudiante no encontrado o rol inválido" });
    }

    // Verificar que tutorId sea un tutor existente
    const tutor = await prisma.person.findUnique({
      where: { id: tutorId },
    });
    if (!tutor || tutor.role !== "Tutor") {
      return res
        .status(404)
        .json({ message: "Tutor no encontrado o rol inválido" });
    }

    // Verificar que el estudiante no esté ya en el curso
    const isAlreadyParticipant = course.participants.some(
      (p) => p.id === personId,
    );
    if (isAlreadyParticipant) {
      return res
        .status(400)
        .json({ message: "El estudiante ya está en el curso" });
    }

    await prisma.course.update({
      where: { id: courseId },
      data: {
        participants: { connect: { id: personId } },
        tutor: { connect: { id: tutorId } },
      },
    });

    res.status(200).json({ message: "Se agrego al curso correctamente" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export { createCourse, getCourses, getCourseSearch, addToCourse };
