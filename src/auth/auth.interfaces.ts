import { Credential } from '@prisma/client';
import { Request } from 'express';

export interface ILogInResponse {
  token: string;
}

export interface IAuthController {
  logIn(req: Request): Promise<ILogInResponse>;
}

export interface IAuthService {
  signIn(user: string, pass: string): Promise<Credential>;
  logIn(user: string, pass: string): Promise<ILogInResponse>;
  verify(token: string): boolean;
  delete(user: string): Promise<void>
}
