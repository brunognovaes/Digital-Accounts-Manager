import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Transfer, TransferStatus } from '@prisma/client';
import { AccountsService } from 'src/accounts/accounts.service';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { TransfersController } from './transfers.controller';
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

const mockTransfersService = {
  processStatus: jest.fn().mockImplementation(async () => mockTransfer),
  create: jest.fn().mockImplementation(async () => mockTransfer),
  getById: jest.fn().mockImplementation(async () => mockTransfer),
  list: jest.fn().mockImplementation(async () => mockPaginatedResponse),
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
        message: mockMessage,
        accountId: mockAccountId,
      });

      expect(response).toEqual(mockTransfer);
      expect(mockTransfersService.create).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledWith(
        mockId,
        TransferStatus.APPROVED,
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
        message: mockMessage,
        accountId: mockAccountId,
      });

      expect(response).toEqual(mockTransfer);
      expect(mockTransfersService.create).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledWith(
        mockId,
        TransferStatus.REFUSED,
      );
      expect(mockAccountsService.cashIn).toHaveBeenCalledTimes(1);
    });

    it('should create transfer with status APPROVED and credit false successfully', async () => {
      const response = await transfersController.create({
        amount: mockAmount,
        credit: false,
        message: mockMessage,
        accountId: mockAccountId,
      });

      expect(response).toEqual(mockTransfer);
      expect(mockTransfersService.create).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledWith(
        mockId,
        TransferStatus.APPROVED,
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
        message: mockMessage,
        accountId: mockAccountId,
      });

      expect(response).toEqual(mockTransfer);
      expect(mockTransfersService.create).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledTimes(1);
      expect(mockTransfersService.processStatus).toHaveBeenCalledWith(
        mockId,
        TransferStatus.REFUSED,
      );
      expect(mockAccountsService.cashOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should return transfer successfully', async () => {
      const response = await transfersController.getById(mockId);

      expect(response).toBeDefined();
      expect(response).toEqual(mockTransfer);
      expect(mockTransfersService.getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('list', () => {
    it('should return transfers successfully', async () => {
      const response = await transfersController.list({
        itemsPerPage: 2,
        order: Prisma.SortOrder.desc,
        page: 0,
      });

      expect(response).toBeDefined();
      expect(response).toEqual(mockPaginatedResponse);
      expect(mockTransfersService.list).toHaveBeenCalledTimes(1);
    });
  });
});
