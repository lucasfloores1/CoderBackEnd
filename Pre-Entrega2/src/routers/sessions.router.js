import Router from 'express';
import userModel from '../models/user.model.js';

const router = Router();

router.post('/sessions/register', async (req,res) => {
    const { 
        body : {
            first_name,
            last_name,
            username,
            email,
            password,
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
        return res.render('error', { title : 'Error', errorMessage : `All fields are required` })
    }
    const user = await userModel.create({
        first_name,
        last_name,
        username,
        email,
        password,
        role,
    })
    res.redirect('/login');
});

router.post('/sessions/login', async (req, res) => {
    const { body : { email, password } } = req;
    if ( !email || !password ){
        return res.render('error', { title : 'Error', errorMessage : `All fields are required` })
    }
    const user = await userModel.findOne({ email : email });
    if (!user){
        return res.render('error', { title : 'Error', errorMessage : `email or password are wrong` })
    }
    if (user.password !== password){
        return res.render('error', { title : 'Error', errorMessage : `email or password are wrong` })
    }
    const {
        first_name,
        last_name,
        username,
        role,
    } = user;
    req.session.user = {
        first_name,
        last_name,
        username,
        role
    };
    res.redirect('/products');
});

router.get('/sessions/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.render('error', { title: 'Error', messageError: error.message });
        }
        res.redirect('/login');
    });
});

export default router;