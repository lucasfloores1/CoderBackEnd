import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import userModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';


export const init = () => {

    const registerOpts = {
        usernameField: 'email',
        passReqToCallback: true,
    };

    passport.use('register', new LocalStrategy( registerOpts, async (req, email, password, done) => {
        const { 
            body : {
                first_name,
                last_name,
                username,
                role,
            } 
        } = req;
        if (
            !first_name ||
            !last_name ||
            !username ||
            !email ||
            !password
        ){
            return done(new Error('All fields are required'))
        }
        const user = await userModel.findOne({ email });
        if (user){
            return done(new Error('This email is already used'))
        }
        const newUser = await userModel.create({
            first_name,
            last_name,
            username,
            email,
            password : createHash(password),
            role,
        })
        done(null, newUser);
    }));   

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const user = await userModel.findOne({ email });
        if (!user) {
            return done(new Error( 'email or password are wrong' ));
        }
        const isNotValidPw = !isValidPassword(password, user);
        if (isNotValidPw) {
            return done(new Error( 'email or password are wrong' ));
        }
        done(null, user);
    }));

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
            name : profile._json.name,
            email,
            username : profile._json.name,
            password : profile._json.email,
        }
        const newUser = await userModel.create(githubUser);
        done(null, newUser);
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (uid, done) => {
        const user = await userModel.findById(uid);
        done(null, user);
    });
};