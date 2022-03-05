import express, { Request, Response } from 'express';
import { googleOauthLink, googleOauthHander } from '../controllers/googleAuth';
import checkSession from '../middleware/deserializeUser';

const router = express.Router();

router.get('/google', googleOauthLink);

router.get('/google/redirect', googleOauthHander);

router.get('/getUser', checkSession, (_: Request, res: Response) => {
  res.status(200).json(res.locals.currentUser);
});

export default router;
