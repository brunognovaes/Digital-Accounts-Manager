import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { AppError } from 'src/common/error/app.error';
import authErrors from './auth.errors';

const mockUser = 'user';
const mockPass = 'pass';
const mockToken = 'token';
const mockHash = 'hash';
const mockCredential = {
  id: 'uuid',
  user: mockUser,
  hash: mockHash,
  created_at: '01-01-01T00:00:00Z',
  updated_at: '01-01-01T00:00:00Z',
};

const prismaMock = {
  credential: {
    findUnique: () => mockCredential,
    create: () => mockCredential,
  },
};

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

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('logIn', () => {
    it('should return successfully the token when credentials are correct', () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

      const response = authService.logIn(mockUser, mockPass);

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual({
        token: mockToken,
      });
    });

    it('should throw an error when user not exists', () => {
      jest
        .spyOn(prismaMock.credential, 'findUnique')
        .mockImplementation(() => null);

      const response = authService.logIn(mockUser, mockPass);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(authErrors.INVALID_CREDENTIALS);
    });

    it('should throw an error when password is invalid', () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      const response = authService.logIn(mockUser, mockPass);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(authErrors.INVALID_CREDENTIALS);
    });
  });

  describe('signIn', () => {
    it("should create successfully a credential when user isn't already registered", () => {
      jest
        .spyOn(prismaMock.credential, 'findUnique')
        .mockImplementation(() => null);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => mockHash);

      const response = authService.signIn(mockUser, mockPass);

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(mockCredential);
    });

    it('should return an error when user is already registered', () => {
      const response = authService.signIn(mockUser, mockPass);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(authErrors.ALREADY_REGISTERED);
    });
  });
});
