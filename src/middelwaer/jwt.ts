import "dotenv/config";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient";

export const verify = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token no proporcionado o formato inválido",
        error: "Token no proporcionado o formato inválido",
      });
    }

    const token = authHeader.substring(7);

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: "Error interno del servidor",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Token inválido o expirado",
        error: "Token inválido o expirado",
      });
    }

    const log = await prisma.tokenLog.findUnique({
      where: { token },
      include: { usuario: true },
    });

    if (!log) {
      return res.status(401).json({
        message: "Sesión no encontrada",
        error: "Sesión no encontrada",
      });
    }

    if (log.revocado) {
      return res.status(401).json({
        message: "Sesión revocada",
        error: "Sesión revocada",
      });
    }
  } catch (error) {}
};
