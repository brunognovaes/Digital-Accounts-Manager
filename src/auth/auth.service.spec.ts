import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AppError } from 'src/common/error/app.error';
import { PrismaService } from 'src/prisma.service';
import authErrors from './auth.errors';
import { AuthService } from './auth.service';

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

const mockPrisma = {
  credential: {
    findUnique: async () => mockCredential,
    create: async () => mockCredential,
    delete: async () => mockCredential,
  },
};

const mockJwt = {
  signAsync: async () => mockToken,
  verify: () => ({ user: mockUser }),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwt,
        },
        {
          provide: PrismaService,
          useValue: mockPrisma,
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
        .spyOn(mockPrisma.credential, 'findUnique')
        .mockImplementation(async () => null);

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
        .spyOn(mockPrisma.credential, 'findUnique')
        .mockImplementation(async () => null);
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

  describe('verify', () => {
    it('should return true when token is valid', () => {
      const response = authService.verify(mockToken);

      expect(response).toBeDefined();
      expect(response).toBe(true);
    });

    it('should return false when token is invalid', () => {
      jest.spyOn(mockJwt, 'verify').mockImplementation(() => {
        throw new Error('Fail on verify');
      });

      const response = authService.verify(mockToken);

      expect(response).toBeDefined();
      expect(response).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a user that exists', () => {
      const response = authService.delete(mockUser);

      expect(response).resolves.not.toBeDefined();
    });

    it('should throw an error when credential not found', () => {
      jest
        .spyOn(mockPrisma.credential, 'findUnique')
        .mockImplementation(async () => null);

      const response = authService.delete(mockUser);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(authErrors.NOT_FOUND);
    });
  });
});
