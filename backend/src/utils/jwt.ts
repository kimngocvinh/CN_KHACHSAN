import * as jwt from 'jsonwebtoken';
import { config } from '../config';

export const generateToken = (userId: number, roleId: number): string => {
  const payload = { userId, roleId };
  const secret = config.jwt.secret;
  const options: jwt.SignOptions = { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] };
  
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};
