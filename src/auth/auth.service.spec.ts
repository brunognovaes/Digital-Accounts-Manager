import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { AppError } from 'src/common/error/app.error';
import authErrors from './auth.errors';

const mockUser = '123456789';
const mockPass = '123456789';
const mockToken = 'token';
const mockCredential = {
  id: 'uuid',
  user: mockUser,
  hash: 'hash',
  created_at: '01-01-01T00:00:00Z',
  updated_at: '01-01-01T00:00:00Z',
};

const prismaMock = { credential: { findUnique: () => mockCredential } };

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: () => mockToken,
          },
        },
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('logIn', () => {
    it('should return successfully the token when credentials are correct', () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

      const response = authService.logIn(mockUser, mockPass);

      expect(response).toBeDefined();
      expect(response).resolves.toEqual({
        token: mockToken,
      });
    });

    it('should throw an error when user not exists', () => {
      jest
        .spyOn(prismaMock.credential, 'findUnique')
        .mockImplementation(() => null);

      const response = authService.logIn(mockUser, mockPass);

      expect(response).toBeDefined();
      expect(response).rejects.toBeInstanceOf(AppError);
      expect(response).rejects.toEqual(authErrors.INVALID_CREDENTIALS);
    });

    it('should throw an error when password is invalid', () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      const response = authService.logIn(mockUser, mockPass);

      expect(response).toBeDefined();
      expect(response).rejects.toBeInstanceOf(AppError);
      expect(response).rejects.toEqual(authErrors.INVALID_CREDENTIALS);
    });
  });
});
