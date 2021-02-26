import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from 'yup';

class UserController {
    async create(request: Request, response: Response) {
        const { name, email} = request.body;
        const usersRepository = getCustomRepository(UsersRepository);

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        });

        try {
            await schema.validate(request.body,{abortEarly: false});
        }catch(err) {
            return response.status(402).json({
                error: err});
        }

        const userAlreadyExists = await usersRepository.findOne({
            email
        });

        if (userAlreadyExists) {
            return response.status(401).json({
                error: "Usuário já existe !",
            });
        }

        const user = usersRepository.create({
            name, email
        });

        await usersRepository.save(user);

        return response.status(201).json(user);
    }
}

export { UserController };
