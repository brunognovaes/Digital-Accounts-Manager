import { Injectable } from '@nestjs/common';
import { IAuthService, ILogInResponse } from './auth.interfaces';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import authErrors from './auth.errors';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  signIn(user: string, pass: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async logIn(user: string, pass: string): Promise<ILogInResponse> {
    const credentials = await this.prismaService.credential.findUnique({
      where: {
        user,
      },
    });

    if (!credentials) {
      throw authErrors.INVALID_CREDENTIALS;
    }

    const compareHash = await bcrypt.compare(pass, credentials.hash);

    if (!compareHash) {
      throw authErrors.INVALID_CREDENTIALS;
    }

    const token = await this.jwtService.signAsync({
      user,
    });

    return { token };
  }

  verify(): boolean {
    throw new Error('Method not implemented.');
  }
}
