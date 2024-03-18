import { Router } from "express";
import { isValidPassword, generateToken, authMiddleware, createHash, generateRestorePasswordToken, __dirname, verifyToken, documentUploader, checkDocuments } from "../../utils/utils.js";
import passport from "passport";
import UsersService from "../../services/users.service.js";
import UserDTO from "../../dto/user.dto.js";
import EmailService from "../../services/email.service.js";
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { logger } from "../../config/logger.js";
import { Logger } from "winston";

const router = Router();

//Local Login
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UsersService.connect(email);
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
    /*const payload = await verifyToken(token);
    req.user = payload;*/
    logger.debug(`User ${user.email} logged in`);
    return res.status(200).send({ status : 'success' })
    //view
    //return res.redirect('/products');
});

//Local Register
router.post('/auth/register', passport.authenticate('register', { session: false }), async (req, res) => {
    try {
      res.status(200).json({status : 'success'})
      //views
      //res.redirect('/login');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//Github
router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email']}));

router.get('/sessions/github/callback', passport.authenticate('github', { session: false }), async (req, res) => {
  try {
    await UsersService.connect(req.user.email);
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

//Current
router.get('/auth/current', authMiddleware('jwt'), async (req, res) => {
     const token = req.cookies.accessToken;
     try {
      const payload = await verifyToken(token);
      logger.debug(`User ${payload.email} requested his current payload`)
      res.status(200).send({ status : 'success', payload : payload });
    } catch (error) {
      res.status(500).send({ error : error.message });
    }
    /*const { accessToken } = req.query;
    try {
      console.log('accessToken', accessToken);
      const payload = await verifyToken(accessToken);
      console.log(payload);
      res.status(200).send({ status : 'success', payload : payload });
    } catch (error) {
      res.status(500).send({ error : error.message });
    }*/
    
    /*if (req.user) {
      const user = new UserDTO( await UsersService.getByEmail(req.user.email) );
      
        res.status(200).json({ user : user })
    } else {
        res.status(500).send({ error : 'There was an error getting your user' })
    }*/
});

//Logout
router.get('/auth/logout',authMiddleware('jwt'), async (req, res) => {
  await UsersService.connect(req.user.email);
  res.clearCookie('accessToken');
  req.user = null;
  res.redirect('/login');
});

//Restore Password
router.post('/auth/restore-password/email', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UsersService.getByEmail(email);
    const token = generateRestorePasswordToken(user.email)
    const emailService = EmailService.getInstance();
    const source = fs.readFileSync(path.join(__dirname, '../views/restore-pw-email-template.handlebars'), 'utf8');
    const template = handlebars.compile(source);
    const html = template({ token })

    const result = await emailService.sendEmail(user.email, 'Link to restore your password', html);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ error : error.message })
  }
});

router.post('/auth/restore-password', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UsersService.getByEmail(email);
    if (isValidPassword(password, user)) {
      res.render('restore-pw', { email, repeated : true })
    }
    const newPassword = createHash(password);
    await UsersService.updateByEmail(email, { password : newPassword });
    res.render('login');
  } catch (error) {
    res.status(500).send({ error : 'There was an error while restoring your password' })
  }
});

//Premium User
router.get('/auth/users/premium/:uid', async (req,res) => {
  const { uid } = req.params;
  try {
    const user = await UsersService.getById(uid);
    switch (user.role) {
      case 'admin':
        throw new Error('admin cant get premium role');
      case 'user':
        if ( checkDocuments( user.documents ) ) {
          await UsersService.updateById( uid, { role : 'premium' } );
          const newPremiumUser = await UsersService.getById(uid);
          logger.debug(`User ${newPremiumUser.email} got upgraded to premium user`);
          return res.status(200).send({ status : 'success', payload : newPremiumUser });
        }
        throw new Error('User did not uploaded all the documents required yet')
      case 'premium':
        await UsersService.updateById( uid, { role : 'user' } );
        const newUser = await UsersService.getById(uid);
        logger.debug(`User ${newUser.email} got downgraded to regular user`);
        return res.status(200).send({ status : 'success', payload : newUser });
      default:
        throw new Error('something was wrong');
    }
  } catch (error) {
    res.status(500).send({ error : error.message })
  }
});

//Document uploading
router.post('/auth/users/current/documents/:typeFile', authMiddleware('jwt'), documentUploader.single('file'), async (req,res) => {
  try {
    const { user, file, params : { typeFile } }= req
    await UsersService.uploadFile(user.id, file);
    logger.debug(`User ${user.email} uploaded the ${typeFile} file named ${file.originalname}`)
    res.status(200).send({ status: 'success' })
  } catch (error) {
    res.status(500).send({ error : error.message })
  }
});

export default router;