import fs from 'fs';
import path from "path";
import handlebars from "handlebars";
import EmailService from "../services/email.service.js";
import UsersService from "../services/users.service.js";
import { InvalidDataException, NotFoundException, UnauthorizedException } from "../utils/exception.js";
import { generateRestorePasswordToken, __dirname, generateToken, isValidPassword, checkDocuments } from "../utils/utils.js";
import { logger } from "../config/logger.js";

export default class AuthController {

    static async login (data) {
        const { email, password } = data;
        const user = await UsersService.getByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if ( !isValidPassword(password , user) ) {
            throw new UnauthorizedException('Invalid credentials');
        }    
        await UsersService.updateByEmail(email, { last_connection : Date.now() });
        const token = generateToken(user);
        return token;
    }

    static async connect (email) {
        await UsersService.updateByEmail(email, { last_connection : Date.now() });
    }

    static async sendEmailRestorePassword (email) {
        const user = await UsersService.getByEmail(email);
        const token = generateRestorePasswordToken(user.email);
        const emailService = EmailService.getInstance();
        const source = fs.readFileSync(path.join(__dirname, '../views/restore-pw-email-template.handlebars'), 'utf8');
        const template = handlebars.compile(source);
        const html = template({ token })    
        const result = await emailService.sendEmail(user.email, 'Link to restore your password', html);
        logger.debug(`An email was sent to ${user.email} to restore the password`);
        return result;
    }

    static async premiumUser(uid) {
        const user = await UsersService.getById(uid);
        switch (user.role) {
          case 'admin':
            throw new InvalidDataException('Admin cant get premium role');
          case 'user':
            if ( checkDocuments( user.documents ) ) {
              await UsersService.updateById( uid, { role : 'premium' } );
              const newPremiumUser = await UsersService.getById(uid);
              logger.debug(`User ${newPremiumUser.email} got upgraded to premium user`);
              return newPremiumUser;
            }
            throw new UnauthorizedException('User did not uploaded all the documents required yet');
          case 'premium':
            await UsersService.updateById( uid, { role : 'user' } );
            const newUser = await UsersService.getById(uid);
            logger.debug(`User ${newUser.email} got downgraded to regular user`);
            return newUser;
          default:
            throw new NotFoundException('User not found')
        }
    }
    
}