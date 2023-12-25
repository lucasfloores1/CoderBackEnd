import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import userModel from '../models/user.model.js';
import { createHash, JWT_SECRET } from '../utils.js';
import CartsManager from '../dao/Carts.manager.js';


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
            return done(new Error('All fields are required'))
        }
        const user = await userModel.findOne({ email });
        if (user){
            return done(new Error('This email is already used'))
        }
        const cart = await CartsManager.create();
        const newUser = await userModel.create({
            first_name,
            last_name,
            age,
            email,
            cart : cart._id,
            password : createHash(password),
            role,
        })
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
        secretOrKey : JWT_SECRET,
        jwtFromRequest : ExtractJwt.fromExtractors([cookieExtractor]),
    }

    passport.use('jwt', new JWTStrategy(jwtOptions, (payload, done) => {
        return done(null, payload);
    }));

    //Github
    const githubOpts = {
        clientID: 'Iv1.f3cec4f4d6afe0ba',
        clientSecret: '1cf0cdb71841f8da0318f0277276c1eb6ab76080',
        callbackURL : 'http://localhost:8080/api/sessions/github/callback',
    }
    passport.use('github', new GithubStrategy(githubOpts, async (accesstoken, refreshToken, profile, done) => {
        const email = profile._json.email;
        const user = await userModel.findOne({ email });
        if (user) {
            return done(null, user);
        }
        const githubUser = {
            first_name : profile._json.name,
            last_name : '',
            email,
            password : '',
            age : '00'
        }
        const newUser = await userModel.create(githubUser);
        done(null, newUser);
    }));

    /*passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (uid, done) => {
        const user = await userModel.findById(uid);
        done(null, user);
    });*/
};