import { Router } from "express";
import userModel from '../models/user.model.js'
import { createHash, isValidPassword, generateToken, verifyToken } from "../utils.js";

const router = Router();

export const jwtAuth = async (req, res, next) => {
    const { headers : { authorization : token } } = req;
    const payload = await verifyToken( token );
    if (!payload) {
        res.status(401).json({ message : 'User does not have enough permissions' })
    }
    req.user = payload;
    next();
};

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        res.status(401).json({ message : 'User not found' })
    }
    const isNotValidPassword = !isValidPassword(password, user);
    if (isNotValidPassword) {
        res.status(401).json({ message : 'email or password are wrong' })
    }
    const token = generateToken(user);
    res.cookie('access_token', token, { httpOnly: true });
    //res.status(200).json({ access_token : token });
    res.redirect('/products');
});

router.post('/auth/register', async (req, res) => {

});

export default router;