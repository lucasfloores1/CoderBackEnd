import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { createHash } from '../utils/utils.js';
import CartController from '../controllers/carts.controller.js';
import config from './config.js';
import UsersService from '../services/users.service.js';
import userModel from '../dao/models/user.model.js';
import { logger } from './logger.js';
import { InvalidDataException, UnauthorizedException } from '../utils/exception.js';


export const init = () => {

    //Local Register
    const registerOpts = {
        usernameField: 'email',
        passReqToCallback: true,
    };

    passport.use('register', new LocalStrategy( registerOpts, async (req, email, password, done) => {
        const { 
            body : {
                first_name,
                last_name,
                role,
                age,
            } 
        } = req;
        if (
            !first_name ||
            !last_name ||
            !email ||
            !age ||
            !password
        ){
            return done(new InvalidDataException('All the fields are required'))
        }
        const user = await UsersService.getByEmail(email)
        if (user){
            return done(new UnauthorizedException('This email is already used'))
        }
        const cart = await CartController.create();
        const newUser = await UsersService.create({
            first_name,
            last_name,
            age,
            email,
            password : createHash(password),
            role,
            cart : cart._id
        })
        logger.debug(`User ${newUser.email} signed up`);
        done(null, newUser);
    }));   

    //JWT
    const cookieExtractor = (req) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies.accessToken;
        }
        return token;
    };

    const jwtOptions = {
        secretOrKey : config.jwt_secret,
        jwtFromRequest : ExtractJwt.fromExtractors([cookieExtractor]),
    }

    passport.use('jwt', new JWTStrategy(jwtOptions, (payload, done) => {
        return done(null, payload);
    }));

    //Github
    const githubOpts = {
        clientID: config.github_client_id,
        clientSecret: config.github_secret_key,
        callbackURL : 'http://localhost:8080/api/sessions/github/callback',
    }
    passport.use('github', new GithubStrategy(githubOpts, async (accesstoken, refreshToken, profile, done) => {
        const email = profile._json.email;
        const user = await userModel.findOne({ email })
        if (user) {
            return done(null, user);
        }
        const cart = await CartController.create();
        const githubUser = {
            first_name : profile._json.name.split(' ')[0],
            last_name : profile._json.name.split(' ')[1],
            email,
            password : ' ',
            age : '00',
            cart : cart._id
        }
        const newUser = await UsersService.create(githubUser);
        done(null, newUser);
    }));

};