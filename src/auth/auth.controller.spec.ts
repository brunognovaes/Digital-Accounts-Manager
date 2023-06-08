import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import authErrors from './auth.errors';
import { AppError } from 'src/common/error/app.error';
import { Request } from 'express';

const mockUser = '123456789';
const mockPass = '123456789';
const mockReq = {
  headers: {
    authorization: 'basic authorization',
  },
} as Request;

const mockAuthService = {
  logIn: async () => ({ token: 'token' }),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('logIn', () => {
    it('should successfully execute when user and pass are correct', async () => {
      jest
        .spyOn(Buffer, 'from')
        .mockReturnValue(Buffer.from(`${mockUser}:${mockPass}`));

      const response = authController.logIn(mockReq);

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual({
        token: 'token',
      });
    });

    it('should throw an error when service throws an error', () => {
      jest
        .spyOn(Buffer, 'from')
        .mockReturnValue(Buffer.from(`${mockUser}:${mockPass}`));

      jest.spyOn(mockAuthService, 'logIn').mockImplementation(async () => {
        throw authErrors.INVALID_CREDENTIALS;
      });

      const response = authController.logIn(mockReq);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
    });

    it('should throw an error when authorization schema is not "basic"', () => {
      jest.replaceProperty(mockReq, 'headers', {
        authorization: 'Bearer token',
      });

      const response = authController.logIn(mockReq);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(authErrors.INCORRECT_SCHEMA);
    });

    it('should throw an error when authorization is not passed on headers', () => {
      jest.replaceProperty(mockReq, 'headers', {
        authorization: null,
      });

      const response = authController.logIn(mockReq);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(authErrors.MISSING_AUTHORIZATION);
    });
  });
});
