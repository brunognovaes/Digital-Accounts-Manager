import { Injectable } from '@nestjs/common';
import { IAuthService, ILogInResponse } from './auth.interfaces';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import authErrors from './auth.errors';
import { Credential } from '@prisma/client';

const DEFAULT_ROUNDS = 10;

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signIn(user: string, pass: string): Promise<Credential> {
    const alreadyRegistered = await this.prismaService.credential.findUnique({
      where: {
        user,
      },
    });

    if (alreadyRegistered) {
      throw authErrors.ALREADY_REGISTERED;
    }

    const hash = await bcrypt.hash(pass, DEFAULT_ROUNDS);

    const credentials = await this.prismaService.credential.create({
      data: {
        hash,
        user,
      },
    });

    return credentials;
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
