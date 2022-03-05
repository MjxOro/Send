import axios from 'axios';
import { Response, Request } from 'express';
import User, { IUser } from '../models/User';
import Session from '../models/Sessions';
import jwt from 'jsonwebtoken';

interface IGoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}
interface IGoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
export const googleOauthLink = (req: Request, res: Response): void => {
  const url = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: process.env.GOOGLE_REDIRECT as string,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ')
  };
  const query = new URLSearchParams(options);
  res.redirect(`${url}?${query.toString()}`);
};

const getGoogleOauthTokens = async ({
  code
}: {
  code: string;
}): Promise<IGoogleTokensResult> => {
  const url = 'https://oauth2.googleapis.com/token';
  const options = {
    code: code,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_REDIRECT as string,
    grant_type: 'authorization_code'
  };
  const query = new URLSearchParams(options);
  try {
    const res = await axios.post(url, query.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return res.data;
  } catch (e: any) {
    console.log('failed to fetch tokens');
    throw new Error(e.message);
  }
};
const getGoogleUser = async ({
  id_token,
  access_token
}: {
  id_token: string;
  access_token: string;
}): Promise<IGoogleUserResult> => {
  const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${id_token}` }
    });
    return res.data;
  } catch (e: any) {
    console.log(e, 'failed to fetch user');
    throw new Error(e.message);
  }
};

export const googleOauthHander = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const code = req.query.code as string;
    const { id_token, access_token } = await getGoogleOauthTokens({ code });
    const googleUser = await getGoogleUser({ id_token, access_token });
    // add User to db
    const checkUser = await User.find({ email: googleUser.email }).lean();
    if (!checkUser) {
      const newUser = new User({
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture
      });
      newUser.save();
    }
    const user: IUser = await User.findOne({ email: googleUser.email }).lean();
    // create session
    const newSession = await Session.findOneAndUpdate(
      { userId: user._id },
      { userId: user._id, valid: true },
      {
        upsert: true,
        new: true
      }
    ).lean();
    //create access_token and refresh_tokens for the session
    const accessToken = jwt.sign(
      { ...user, sessionId: newSession._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h' // 1 hour
      }
    );
    const refreshToken = jwt.sign(
      { ...user, sessionId: newSession._id },
      process.env.JWT_SECRET as string,
      { expiresIn: 31536000 } // 1 year
    );

    res.cookie('access_token', accessToken, {
      maxAge: 900000, // 15 mins
      httpOnly: true,
      domain: process.env.DOMAIN as string,
      sameSite: 'lax',
      secure: (process.env.NODE_ENV as string) === 'production'
    });
    res.cookie('refresh_token', refreshToken, {
      maxAge: 31536000, // 15 mins
      httpOnly: true,
      domain: process.env.DOMAIN as string,
      sameSite: 'lax',
      secure: (process.env.NODE_ENV as string) === 'production'
    });
    // send to origin
    res.redirect(`${process.env.CORSORIGIN as string}/dashboard`);
  } catch (e: any) {
    console.log('fail to auth user');
    throw new Error(e.message);
  }
};
