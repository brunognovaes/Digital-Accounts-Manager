import { Test, TestingModule } from '@nestjs/testing';
import { Account, Prisma } from '@prisma/client';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { HoldersService } from 'src/holders/holders.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

const mockId = 'id';
const mockHolderId = 'holderId';
const mockNumber = '1234567';
const mockBranch = '1';
const mockBalance = 10;

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

const mockFormatedAccount = {
  id: mockId,
  active: true,
  balance: mockBalance,
  blocked: false,
  branch: mockBranch,
  holder_id: mockHolderId,
  number: mockNumber,
  created_at: new Date('01-01-01T00:00:00Z'),
  updated_at: new Date('01-01-01T00:00:00Z'),
};

const mockFormatedPaginatedResponse = {
  metadata: {
    currentItems: 2,
    maxPage: 0,
    order: Prisma.SortOrder.desc,
    page: 0,
  },
  values: [mockFormatedAccount, mockFormatedAccount],
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

const mockName = 'name';
const mockDocument = 'document';
const mockHolder = {
  id: mockId,
  name: mockName,
  document: mockDocument,
  created_at: '01-01-01T00:00:00Z',
  updated_at: '01-01-01T00:00:00Z',
};

const mockHoldersService = {
  getByDocument: jest.fn().mockImplementation(async () => mockHolder),
};

const mockAccountsService = {
  create: jest.fn().mockImplementation(async () => mockAccount),
  list: jest.fn().mockImplementation(async () => mockPaginatedResponse),
  getById: jest.fn().mockImplementation(async () => mockAccount),
  updateConfigs: jest.fn().mockImplementation(async () => mockAccount),
};

describe('AccountsController', () => {
  let accountsController: AccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: mockAccountsService,
        },
        {
          provide: HoldersService,
          useValue: mockHoldersService,
        },
      ],
    }).compile();

    accountsController = module.get<AccountsController>(AccountsController);

    jest
      .spyOn(accountsController, 'formatAccount')
      .mockImplementation(() => mockFormatedAccount);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(accountsController).toBeDefined();
  });

  describe('create', () => {
    it('should create a account succesfully', async () => {
      const response = await accountsController.create({
        document: mockDocument,
      });

      expect(response).toBeDefined();
      expect(response).toEqual(mockFormatedAccount);
      expect(mockAccountsService.create).toHaveBeenCalledTimes(1);
      expect(mockHoldersService.getByDocument).toHaveBeenCalledTimes(1);
    });
  });

  describe('list', () => {
    it('should list accounts successfully', async () => {
      const response = await accountsController.list(
        {
          itemsPerPage: 2,
          order: Prisma.SortOrder.desc,
          page: 0,
        },
        mockHolderId,
      );

      expect(response).toBeDefined();
      expect(response).toEqual(mockFormatedPaginatedResponse);
      expect(mockAccountsService.list).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should get a account by id successfully', async () => {
      const response = await accountsController.getById(mockId);

      expect(response).toBeDefined();
      expect(response).toEqual(mockFormatedAccount);
      expect(mockAccountsService.getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('close', () => {
    it('should inactive a account successfully', async () => {
      const response = await accountsController.close(mockId);

      expect(response).toBeDefined();
      expect(response).toEqual(mockFormatedAccount);
      expect(mockAccountsService.updateConfigs).toHaveBeenCalledTimes(1);
      expect(mockAccountsService.updateConfigs).toHaveBeenCalledWith(
        { active: false },
        mockId,
      );
    });
  });

  describe('block', () => {
    it('should inactive a account successfully', async () => {
      const response = await accountsController.block(mockId);

      expect(response).toBeDefined();
      expect(response).toEqual(mockFormatedAccount);
      expect(mockAccountsService.updateConfigs).toHaveBeenCalledTimes(1);
      expect(mockAccountsService.updateConfigs).toHaveBeenCalledWith(
        { blocked: true },
        mockId,
      );
    });
  });

  describe('unblock', () => {
    it('should inactive a account successfully', async () => {
      const response = await accountsController.unblock(mockId);

      expect(response).toBeDefined();
      expect(response).toEqual(mockFormatedAccount);
      expect(mockAccountsService.updateConfigs).toHaveBeenCalledTimes(1);
      expect(mockAccountsService.updateConfigs).toHaveBeenCalledWith(
        { blocked: false },
        mockId,
      );
    });
  });
});
