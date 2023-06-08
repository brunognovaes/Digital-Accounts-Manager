export interface ILogInResponse {
  token: string;
}

export interface IAuthController {
  logIn(user: string, pass: string): Promise<ILogInResponse>;
}

export interface IAuthService {
  signIn(user: string, pass: string): Promise<void>;
  logIn(user: string, pass: string): Promise<ILogInResponse>;
  verify(): boolean;
}
