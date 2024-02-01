import { Router } from "express";
import { isValidPassword, generateToken, authMiddleware, createHash } from "../../utils.js";
import passport from "passport";
import UsersService from "../../services/users.service.js";
import UserDTO from "../../dto/user.dto.js";

const router = Router();

//Local Login
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UsersService.getByEmail(email);
    if (!user) {
        return res.status(401).json({ message: 'Email or password are wrong' });
    }
    const isNotValidPassword = !isValidPassword(password, user);
    if (isNotValidPassword) {
        res.status(401).json({ message : 'email or password are wrong' })
    }
    const token = generateToken(user);
    res.cookie('accessToken', token, {
        maxAge: 12 * 60 * 60 * 1000,//12 hours
        httpOnly: true,
    });
    return res.redirect('/products');
});

//Local Register
router.post('/auth/register', passport.authenticate('register', { session: false }), async (req, res) => {
    try {
      res.redirect('/login');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//Github
router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email']}));

router.get('/sessions/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
  try {
    const token = generateToken(req.user);
    res.cookie('accessToken', token, {
        maxAge: 12 * 60 * 60 * 1000,//12 hours
        httpOnly: true,
    });
    res.redirect('/products');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Restore password
router.post('/auth/restore-password', async (req,res) => {
    const { body : { email, password } } = req;
    if ( !email || !password ){
        return res.render('../views/error.handlebars', { title : 'Error' })
    }
    const user = await UsersService.getByEmail(email);
    if (!user){
        return res.render('../views/error.handlebars', { title : 'Error' })
    }
    user.password = createHash(password);
    await UsersService.updateByEmail(email, user);
    res.redirect('/login')
});

//Current
router.get('/auth/current', authMiddleware('jwt'), async (req, res) => {
    if (req.user) {
      const user = new UserDTO( await UsersService.getByEmail(req.user.email) );
      
        res.status(200).json({ user : user })
    } else {
        res.status(500).send({ error : 'There was an error getting your user' })
    }
});

//Logout
router.get('/auth/logout', (req, res) => {
  res.clearCookie('accessToken');
  req.user = null;
  res.redirect('/login');
});

export default router;