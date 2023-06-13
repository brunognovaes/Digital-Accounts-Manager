import { Test, TestingModule } from '@nestjs/testing';
import { Account, Prisma } from '@prisma/client';
import { AppError } from 'src/common/error/app.error';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { PrismaService } from 'src/prisma.service';
import accountsErrors from './accounts.errors';
import { IUpdateBalanceReturn } from './accounts.interfaces';
import { AccountsService } from './accounts.service';

const mockId = 'id';
const mockHolderId = 'holderId';
const mockNumber = '1234567';
const mockBranch = '1';
const mockBalance = 10;
const amount = 10;

const mockAccount: Account = {
  id: mockId,
  active: true,
  balance: new Prisma.Decimal(mockBalance),
  blocked: false,
  branch: mockBranch,
  holder_id: mockHolderId,
  number: mockNumber,
  created_at: new Date('01-01-01T00:00:00Z'),
  updated_at: new Date('01-01-01T00:00:00Z'),
};

const mockPaginatedResponse: IPaginatedResponse<Account> = {
  metadata: {
    currentItems: 2,
    maxPage: 0,
    order: Prisma.SortOrder.desc,
    page: 0,
  },
  values: [mockAccount, mockAccount],
};

const mockPrisma = {
  account: {
    create: async () => mockAccount,
    findUnique: async () => mockAccount,
    findMany: async () => [mockAccount, mockAccount],
    update: async () => mockAccount,
    count: async () => 2,
  },
};

describe('AccountsService', () => {
  let accountsService: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    accountsService = module.get<AccountsService>(AccountsService);

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(accountsService).toBeDefined();
  });

  describe('create', () => {
    it('should create an account successfully', () => {
      jest.mock('./utils/account-number-generator.util.ts', () => mockNumber);

      const response = accountsService.create(mockHolderId);

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(mockAccount);
    });
  });

  describe('list', () => {
    it('should return a list of accounts and metadatas', () => {
      const response = accountsService.list({
        itemsPerPage: 2,
        order: Prisma.SortOrder.desc,
        page: 0,
      });

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(mockPaginatedResponse);
    });
  });

  describe('getById', () => {
    it('should return a account successfully', () => {
      const response = accountsService.getById(mockId);

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(mockAccount);
    });

    it('should throw an error when holder not found', () => {
      jest.spyOn(mockPrisma.account, 'findUnique').mockResolvedValue(null);

      const response = accountsService.getById(mockId);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(accountsErrors.NOT_FOUND);
    });
  });

  describe('cashIn', () => {
    it('should execute cashIn successfully', () => {
      jest.spyOn(accountsService, 'getById').mockResolvedValue(mockAccount);
      const response = accountsService.cashIn(mockId, amount);

      const expectResponse: IUpdateBalanceReturn = {
        accountId: mockId,
        newBalance: mockBalance + amount,
        oldBalance: mockBalance,
      };

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(expectResponse);
    });

    it('should throw an error when account is inactive', () => {
      jest
        .spyOn(mockPrisma.account, 'findUnique')
        .mockResolvedValue({ ...mockAccount, active: false });

      const response = accountsService.cashIn(mockId, amount);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(accountsErrors.INACTIVE);
    });

    it('should throw an error when account is blocked', () => {
      jest
        .spyOn(mockPrisma.account, 'findUnique')
        .mockResolvedValue({ ...mockAccount, blocked: true });

      const response = accountsService.cashIn(mockId, amount);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(accountsErrors.BLOCKED);
    });
  });

  describe('cashOut', () => {
    it('should execute cashIn successfully', () => {
      jest.spyOn(accountsService, 'getById').mockResolvedValue(mockAccount);

      const response = accountsService.cashOut(mockId, amount);

      const expectResponse: IUpdateBalanceReturn = {
        accountId: mockId,
        newBalance: mockBalance - amount,
        oldBalance: mockBalance,
      };

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(expectResponse);
    });

    it('should throw an error when account is inactive', () => {
      jest
        .spyOn(mockPrisma.account, 'findUnique')
        .mockResolvedValue({ ...mockAccount, active: false });

      const response = accountsService.cashOut(mockId, amount);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(accountsErrors.INACTIVE);
    });

    it('should throw an error when account is blocked', () => {
      jest
        .spyOn(mockPrisma.account, 'findUnique')
        .mockResolvedValue({ ...mockAccount, blocked: true });

      const response = accountsService.cashOut(mockId, amount);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(accountsErrors.BLOCKED);
    });

    it('should throw and error when account has not enough balance', () => {
      jest
        .spyOn(mockPrisma.account, 'findUnique')
        .mockResolvedValue({ ...mockAccount, balance: new Prisma.Decimal(0) });

      const response = accountsService.cashOut(mockId, amount);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(accountsErrors.NOT_ENOUGH_BALANCE);
    });
  });

  describe('updateConfigs', () => {
    it('should update account config successfully', () => {
      jest.spyOn(accountsService, 'getById').mockResolvedValue(mockAccount);

      const response = accountsService.updateConfigs(
        {
          active: true,
          blocked: false,
        },
        mockId,
      );

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(mockAccount);
    });
  });

  it('should throw an error when account is inactive', () => {
    jest
      .spyOn(mockPrisma.account, 'findUnique')
      .mockResolvedValue({ ...mockAccount, active: false });

    const response = accountsService.updateConfigs(
      {
        active: true,
        blocked: false,
      },
      mockId,
    );

    expect(response).rejects.toBeDefined();
    expect(response).rejects.toThrowError(AppError);
    expect(response).rejects.toEqual(accountsErrors.INACTIVE);
  });
});
