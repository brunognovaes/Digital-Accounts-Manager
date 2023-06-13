import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public-request.decorator';
import authErrors from './auth.errors';
import {
  IAuthController,
  IAuthService,
  ILogInResponse,
} from './auth.interfaces';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(@Inject(AuthService) private authService: IAuthService) {}

  @Public()
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
