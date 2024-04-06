import UsersService from "../services/users.service.js";
import EmailService from "../services/email.service.js";
import handlebars from "handlebars";
import fs from 'fs'
import path from "path";
import { checkLastConnection, __dirname } from "../utils/utils.js";
import { logger } from "../config/logger.js";
import { ReducedUserDTO } from "../dto/user.dto.js";

export default class UserController {

    static async uploadFile(uid, file) {
        const user = await UsersService.getById(uid);
        user.documents.push({ name : file.originalname , reference : file.path });
        await user.save();
    }

    static async getReducedUsers() {
        const users = await UsersService.getRaw();
        return users.map( (user) => new ReducedUserDTO(user) );
    }

    static async getByEmail(email) {
        const user = await UsersService.getByEmail(email);
        return user;
    }

    static async getById(uid) {
        const user = await UsersService.getById(uid);
        return user;
    }

    static async updateByEmail(email, data) {
        const user = await UsersService.updateByEmail(email, data);
        return user;
    }

    static async updateById(uid, data) {
        const user = await UsersService.updateById(uid, data);
        return user;
    }
    
    static async getAll() {
        const users = await UsersService.getAll();
        return users;
    }

    static async deleteById(uid) {
        return await UsersService.deleteById(uid);
    }

    static async create(data) {
        const user = await UsersService.create(data);
        return user;
    }

    static async deleteUnactives() {
        const users = await UsersService.getRaw();
        users.map( async (user) => {
            if ( checkLastConnection(user) ) {
                await UsersService.deleteById(user.id);
                logger.debug(`User ${user.email} was deleted for being inactive for more than 2 days`);
                const emailService = EmailService.getInstance();
                const source = fs.readFileSync(path.join(__dirname, '../views/delete-product-email.handlebars'), 'utf8');
                const template = handlebars.compile(source);
                const html = template({ user });
                await emailService.sendEmail(user.email, 'Link to restore your password', html);
            }
        });       
    }
}