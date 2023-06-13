import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Credential } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import authErrors from './auth.errors';
import { IAuthService, ILogInResponse } from './auth.interfaces';

const DEFAULT_ROUNDS = 10;

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async delete(user: string): Promise<void> {
    const credential = await this.prismaService.credential.findUnique({
      where: {
        user,
      },
    });

    if (!credential) {
      throw authErrors.NOT_FOUND;
    }

    await this.prismaService.credential.delete({
      where: {
        user,
      },
    });
  }

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

    const fiveMinutesInSeconds = 300;

    const token = await this.jwtService.signAsync(
      {
        user,
      },
      {
        secret: process.env.SECRET,
        expiresIn: fiveMinutesInSeconds,
      },
    );

    return { token };
  }

  verify(token: string): boolean {
    try {
      this.jwtService.verify<{ user: string }>(token, {
        secret: process.env.SECRET,
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
