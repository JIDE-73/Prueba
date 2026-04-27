import prisma from "../../prisma/prismaClient";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
};

export { };