import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Transfer, TransferStatus } from '@prisma/client';
import { AccountsService } from 'src/accounts/accounts.service';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { TransfersController } from './transfers.controller';
import { IFormatedTransferResponse } from './transfers.interfaces';
import { TransfersService } from './transfers.service';

const mockId = 'id';
const mockAccountId = 'accountId';
const mockAmount = 10;
const mockMessage = 'message';
const mockStatus = TransferStatus.PENDING;

const mockTransfer: Transfer = {
  id: mockId,
  account_id: mockAccountId,
  amount: new Prisma.Decimal(mockAmount),
  credit: true,
  message: mockMessage,
  status: mockStatus,
  created_at: new Date('01-01-01T00:00:00Z'),
  updated_at: new Date('01-01-01T00:00:00Z'),
};

const mockFormatedTransfer: IFormatedTransferResponse = {
  id: mockId,
  account_id: mockAccountId,
  amount: mockAmount,
  credit: true,
  message: mockMessage,
  status: mockStatus,
  created_at: new Date('01-01-01T00:00:00Z'),
  updated_at: new Date('01-01-01T00:00:00Z'),
};

const mockAccountsService = {
  cashIn: jest.fn().mockImplementation(async () => ({
    accountId: mockAccountId,
    oldBalance: 10,
    newBalance: 20,
  })),
  cashOut: jest.fn().mockImplementation(async () => ({
    accountId: mockAccountId,
    oldBalance: 20,
    newBalance: 10,
  })),
};
const mockPaginatedResponse: IPaginatedResponse<Transfer> = {
  metadata: {
    currentItems: 2,
    maxPage: 0,
    order: Prisma.SortOrder.desc,
    page: 0,
  },
  values: [mockTransfer, mockTransfer],
};

const mockFormatedPaginatedResponse: IPaginatedResponse<IFormatedTransferResponse> =
  {
    metadata: {
      currentItems: 2,
      maxPage: 0,
      order: Prisma.SortOrder.desc,
      page: 0,
    },
    values: [mockFormatedTransfer, mockFormatedTransfer],
  };

const mockTransfersService = {
  processStatus: jest.fn().mockImplementation(async () => mockTransfer),
  create: jest.fn().mockImplementation(async () => mockTransfer),
  getById: jest.fn().mockImplementation(async () => mockTransfer),
  list: jest.fn().mockImplementation(async () => mockPaginatedResponse),
  getDailyTotalByAccount: jest
    .fn()
    .mockImplementation(async () => new Prisma.Decimal(mockAmount)),
};

describe('TransfersController', () => {
  let transfersController: TransfersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [
        {
          provide: TransfersService,
          useValue: mockTransfersService,
        },
        {
          provide: AccountsService,
          useValue: mockAccountsService,
        },
      ],
    }).compile();

    transfersController = module.get<TransfersController>(TransfersController);

    jest
      .spyOn(transfersController, 'formatTransfer')
      .mockImplementation(() => mockFormatedTransfer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(transfersController).toBeDefined();
  });

  describe('create', () => {
    it('should create transfer with status APPROVED and credit true successfully', async () => {
      const response = await transfersController.create({
        amount: mockAmount,
        credit: true,
        accountId: mockAccountId,
      });

      expect(response).toEqual(mockFormatedTransfer);
      expect(mockTransfersService.create).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledWith(
        mockId,
        TransferStatus.APPROVED,
        null,
      );
      expect(mockAccountsService.cashIn).toHaveBeenCalledTimes(1);
    });

    it('should create transfer with status REFUSED and credit true successfully', async () => {
      mockAccountsService.cashIn = jest.fn().mockImplementation(async () => {
        throw Error('Testing refused status');
      });

      const response = await transfersController.create({
        amount: mockAmount,
        credit: true,
        accountId: mockAccountId,
      });

      expect(response).toEqual(mockFormatedTransfer);
      expect(mockTransfersService.create).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledWith(
        mockId,
        TransferStatus.REFUSED,
        'Testing refused status',
      );
      expect(mockAccountsService.cashIn).toHaveBeenCalledTimes(1);
    });

    it('should create transfer with status APPROVED and credit false successfully', async () => {
      const response = await transfersController.create({
        amount: mockAmount,
        credit: false,
        accountId: mockAccountId,
      });

      expect(response).toEqual(mockFormatedTransfer);
      expect(mockTransfersService.create).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledWith(
        mockId,
        TransferStatus.APPROVED,
        null,
      );
      expect(mockAccountsService.cashOut).toHaveBeenCalledTimes(1);
    });

    it('should create transfer with status REFUSED and credit false successfully', async () => {
      mockAccountsService.cashOut = jest.fn().mockImplementation(async () => {
        throw Error('Testing refused status');
      });

      const response = await transfersController.create({
        amount: mockAmount,
        credit: false,
        accountId: mockAccountId,
      });

      expect(response).toEqual(mockFormatedTransfer);
      expect(mockTransfersService.create).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledWith(
        mockId,
        TransferStatus.REFUSED,
        'Testing refused status',
      );
      expect(mockAccountsService.cashOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should return transfer successfully', async () => {
      const response = await transfersController.getById(mockId);

      expect(response).toBeDefined();
      expect(response).toEqual(mockFormatedTransfer);
      expect(mockTransfersService.getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('list', () => {
    it('should return transfers successfully', async () => {
      const response = await transfersController.list(
        {
          itemsPerPage: 2,
          order: Prisma.SortOrder.desc,
          page: 0,
        },
        mockAccountId,
      );

      expect(response).toBeDefined();
      expect(response).toEqual(mockFormatedPaginatedResponse);
      expect(mockTransfersService.list).toHaveBeenCalledTimes(1);
    });
  });
});
