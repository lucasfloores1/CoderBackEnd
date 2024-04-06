import { Router } from "express";
import { isValidPassword, generateToken, authMiddleware, createHash, __dirname, verifyToken, documentUploader, authRole } from "../../utils/utils.js";
import passport from "passport";
import { logger } from "../../config/logger.js";
import AuthController from "../../controllers/auth.controller.js";
import UserController from "../../controllers/users.controller.js";

const router = Router();

//Local Login
router.post('/auth/login', async (req, res, next) => {
  try {
    const { body } = req;
    const token = await AuthController.login(body);
    logger.debug(`User ${body.email} logged in`);
    res.
        cookie('accessToken', token, { maxAge: 5 * 60 * 60* 1000, sameSite : 'none', secure : true}).
        status(200).
        send({ status: 'success' , message : 'Logged in' })
    //view
    //return res.redirect('/products');
  } catch (error) {
    next(error);
  }
});

//Local Register
router.post('/auth/register', passport.authenticate('register', { session: false }), async (req, res, next) => {
    try {
      res.status(200).json({ status : 'success', message : 'Signed up' })
      //views
      //res.redirect('/login');
    } catch (error) {
      next(error);
    }
});

//Github
router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email']}));

router.get('/sessions/github/callback', passport.authenticate('github', { session: false }), async (req, res, next) => {
  try {
    await AuthController.connect(req.user.email);
    const token = generateToken(req.user);
    res.
        status(200).
        cookie('accessToken', token, { maxAge: 5 * 60 * 60* 1000, sameSite : 'none', secure : true}).
        send({ status: 'success' })
    //views
    //res.redirect('/products');
  } catch (error) {
    next(error);
  }
});

//Current
router.get('/auth/current', authMiddleware('jwt'), async (req, res, next) => {
     try {
      const token = req.cookies.accessToken;
      const payload = await verifyToken(token);
      logger.debug(`User ${payload.email} requested his data`)
      res.
        status(200).
        send({ status : 'success', payload });
    } catch (error) {
      next(error);
    }
});

//Logout
router.get('/auth/logout',authMiddleware('jwt'), async (req, res, next) => {
  try {
    await AuthController.connect(req.user.email);
    req.user = null;
    res.
      clearCookie('accessToken').
      status(200).
      send({ status : 'success', message : 'Logged out' })
    //views
    //res.redirect('/login');
  } catch (error) {
    next(error);
  }
});

//Restore Password
router.post('/auth/restore-password/email', async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    await AuthController.sendEmailRestorePassword(email);
    res.
      status(200).
      send({ status : 'success', message : 'Email sent' })
  } catch (error) {
    next(error);
  }
});

router.post('/auth/restore-password/:token', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token } = req.params;
    verifyToken(token);
    const user = await UserController.getByEmail(email);
    if (isValidPassword(password, user)) {
      res.
      status(200).
      send({ status : 'success', message : 'Password repeated' });
    }
    const newPassword = createHash(password);
    await UserController.updateByEmail(email, { password : newPassword });
    res.
      status(200).
      send({ status : 'success', message : 'Password restored' })
  } catch (error) {
    next(error);
  }
});

//Premium User
router.get('/auth/users/premium/:uid', async (req,res,next) => {
  const { uid } = req.params;
  try {
    const user = await AuthController.premiumUser(uid);
    res.
      status(200).
      send({ status : 'success', message : `User ${user.email} updated` });
  } catch (error) {
    next(error);
  }
});

//Document uploading
router.post('/auth/users/current/documents/:typeFile', authMiddleware('jwt'), documentUploader.single('file'), async (req,res,next) => {
  try {
    const { user, file, params : { typeFile } }= req
    await UserController.uploadFile(user.id, file);
    logger.debug(`User ${user.email} uploaded the ${typeFile} file named ${file.originalname}`)
    res.
      status(200).
      send({ status: 'success' });
  } catch (error) {
    next(error);
  }
});

//Get Reduced Users
router.get('/auth/users', authMiddleware('jwt'), async (req, res, next) => {
  try {
    const users = await UserController.getReducedUsers();
    logger.debug('The list of reduced info users was requested');
    res.
      status(200).
      send({ status : 'success', payload : users });
  } catch (error) {
    next(error);
  }
});

//Delete Unactive Users
router.delete('/auth/users', authMiddleware('jwt'), authRole(['admin']), async (req, res, next) => {
  try {
    await UserController.deleteUnactives()
    res.
      status(200).
      send({ status : 'success', message : 'Unactive users deleted' });
  } catch (error) {
    next(error)
  }
});

export default router;