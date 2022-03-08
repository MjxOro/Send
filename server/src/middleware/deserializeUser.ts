import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import SessionModel from '../models/Sessions';
import UserModel, { IUser } from '../models/User';

const getNewToken = async ({ refreshToken }: any) => {
  //Method renews access token if there is a refresh token available
  const decode: any = jwt.verify(
    refreshToken,
    process.env.JWT_SECRET as string
  );
  if (!decode) return false;

  const session: any = await SessionModel.findOne({
    googleId: decode.googleId
  }).lean();
  if (!session || !session.valid) return false;
  const id = String(decode._id);

  const currentUser: IUser = await UserModel.findById(id).lean();

  if (!currentUser) return false;
  const accessToken = jwt.sign(
    { ...currentUser, sessionId: session._id },
    process.env.JWT_SECRET as string,
    { expiresIn: 3600000 }
  );
  return accessToken;
};

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get cookies that was stored and verify
  const accessToken: any = req.cookies.access_token || null;
  const refreshToken: any = req.cookies.refresh_token || null;
  if (!accessToken && refreshToken) {
    //Renew access token if refresh token is available
    const newAccessToken: any = await getNewToken({ refreshToken });
    if (!newAccessToken) {
      res.locals.currentUser = false;
      console.log('Could not renew token');
      return res.sendStatus(403);
    }
    res.cookie('access_token', newAccessToken, {
      maxAge: 3600000, // 1 hour
      httpOnly: true,
      domain: (process.env.DOMAIN as string) !== 'localhost' ? '' : 'localhost',
      sameSite: 'lax',
      secure: false
    });
    const decode: any = jwt.verify(
      newAccessToken,
      process.env.JWT_SECRET as string
    );
    res.locals.currentUser = decode;
    return next();
  } else if (!accessToken && !refreshToken && res.locals) {
    return next();
  } else if (!accessToken && !refreshToken) {
    //Return to login page when there are no tokens
    console.log('NOT AUTH');
    return res.sendStatus(403);
  } else if (!accessToken) {
    return next();
  }
  // Verify Token
  const decode: any = jwt.verify(accessToken, process.env.JWT_SECRET as string);
  if (!decode) {
    res.locals.currentUser = false;
    console.log('CANT VERIFY TOKEN');
    return res.sendStatus(403);
  }
  res.locals.currentUser = decode;
  return next();
};
export default deserializeUser;
