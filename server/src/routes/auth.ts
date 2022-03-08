import express, { Request, Response } from 'express';
import { googleOauthLink, googleOauthHander } from '../controllers/googleAuth';
import checkSession from '../middleware/deserializeUser';
import User from '../models/User';

const router = express.Router();

router.get('/google', googleOauthLink);

router.get('/google/redirect', googleOauthHander);

router.get('/getUser', checkSession, async (_: Request, res: Response) => {
  try {
    const userId = res.locals && String(res.locals.currentUser._id);
    if (!userId) {
      return res.sendStatus(403);
    }
    const user = await User.findOne({ _id: userId });
    return res.status(200).json(user);
  } catch (e) {
    return res.sendStatus(403);
  }
});

export default router;
