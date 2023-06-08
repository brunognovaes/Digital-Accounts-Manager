import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import {
  IAuthController,
  IAuthService,
  ILogInResponse,
} from './auth.interfaces';
import { AuthService } from './auth.service';
import { Request } from 'express';
import authErrors from './auth.errors';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(@Inject(AuthService) private authService: IAuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async logIn(@Req() req: Request): Promise<ILogInResponse> {
    const authorization = req.headers['authorization'];

    if (!authorization) {
      throw authErrors.MISSING_AUTHORIZATION;
    }

    const [schema, token] = authorization.split(' ');

    if (schema !== 'Basic') {
      throw authErrors.INCORRECT_SCHEMA;
    }

    const [user, pass] = Buffer.from(token, 'base64')
      .toString('ascii')
      .split(':');

    return this.authService.logIn(user, pass);
  }
}
