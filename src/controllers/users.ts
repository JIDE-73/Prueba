import bcript from 'bcryptjs';
import prisma from '../../prisma/prismaClient';
import {validationResult,check} from 'express-validator';

const creatUser = async (req:any, res:any, next:any ) =>{
    const { username, password, image, personaId } = req.body;

    await check('username').notEmpty.isString().withMessage('Username no valido').run(req);
    await check('password').notEmpty.isString().withMessage('Username no valido').run(req);
    await check('image').notEmpty.isString().withMessage('Username no valido').run(req);
    await check('personaId').notEmpty.isInt().withMessage('Username no valido').run(req);

    const er = validationResult(req);

    if(!er.isEmpty()){
        return res.status(400).json({ errors: er.array()});
    }

    try{
        const h = await bcript.hash(password, 10);
        const newu = await prisma.user.create({

        });

    }catch(e){

    }
    
}

export {};