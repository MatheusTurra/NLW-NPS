import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveyUserRepository } from "../repositories/SurveyUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from "path"

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUserRepository = getCustomRepository(SurveyUserRepository);
        
        const user = await usersRepository.findOne({email});

        if(!user) {
            return response.status(401).json({
                error: "User does not exists"
            })
        }

        const survey = await surveysRepository.findOne({id: survey_id});

        if (!survey) {
            return response.status(401).json({
                error: "Survey does not exists"
            })
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveysUserRepository.findOne({
            where: {user_id: user.id, value: null},
            relations: ["user", "survey"]
        });

        const variables = {
            name: user.id,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        const surveyUser = surveysUserRepository.create({
            user_id: user.id,
            survey_id
        });

        await surveysUserRepository.save(surveyUser);
        
        variables.id = surveyUser.id;
        
        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendMailController };