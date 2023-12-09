import Router from 'express';
import userModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';

const router = Router();

router.post('/sessions/register', passport.authenticate('register', { failureRedirect : '/register' }), async (req,res) => {
    
    res.redirect('/login');
});

router.post('/sessions/login', passport.authenticate('login', { failureRedirect : '/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

router.get('/sessions/logout', async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.render('error', { title: 'Error' });
        }
        res.redirect('/login');
    });
});

router.post('/sessions/restore-password', async (req,res) => {
    const { body : { email, password } } = req;
    if ( !email || !password ){
        return res.render('../views/error.handlebars', { title : 'Error' })
    }
    const user = await userModel.findOne({ email : email });
    if (!user){
        return res.render('../views/error.handlebars', { title : 'Error' })
    }
    user.password = createHash(password);
    await userModel.updateOne({ email }, user);
    res.redirect('/login')
});

router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email']}));

router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/products');
});

export default router;