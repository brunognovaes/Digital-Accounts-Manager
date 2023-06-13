import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Transfer, TransferStatus } from '@prisma/client';
import { AppError } from 'src/common/error/app.error';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { PrismaService } from 'src/prisma.service';
import transfersErrors from './transfers.errors';
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

const mockPaginatedResponse: IPaginatedResponse<Transfer> = {
  metadata: {
    currentItems: 2,
    maxPage: 0,
    order: Prisma.SortOrder.desc,
    page: 0,
  },
  values: [mockTransfer, mockTransfer],
};

const mockPrisma = {
  transfer: {
    create: async () => mockTransfer,
    findUnique: async () => mockTransfer,
    findMany: async () => [mockTransfer, mockTransfer],
    update: async () => mockTransfer,
    count: async () => 2,
  },
};

describe('TransfersService', () => {
  let transfersService: TransfersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    transfersService = module.get<TransfersService>(TransfersService);

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(transfersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a transfer successfully', () => {
      const response = transfersService.create({
        amount: mockAmount,
        credit: true,
        message: mockMessage,
        accountId: mockAccountId,
      });

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(mockTransfer);
    });
  });

  describe('getById', () => {
    it('should return a account successfully', () => {
      const response = transfersService.getById(mockId);

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(mockTransfer);
    });

    it('should throw an error when holder not found', () => {
      jest.spyOn(mockPrisma.transfer, 'findUnique').mockResolvedValue(null);

      const response = transfersService.getById(mockId);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(transfersErrors.NOT_FOUND);
    });
  });

  describe('list', () => {
    it('should return a list of accounts and metadatas', () => {
      const response = transfersService.list({
        itemsPerPage: 2,
        order: Prisma.SortOrder.desc,
        page: 0,
      });

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(mockPaginatedResponse);
    });
  });

  describe('processStatus', () => {
    it('should update status successfully when transfer status is PENDING', () => {
      const response = transfersService.processStatus(
        mockId,
        TransferStatus.APPROVED,
      );

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(mockTransfer);
    });

    it('should throw an error when transfer status is APPROVED', () => {
      jest.spyOn(mockPrisma.transfer, 'findUnique').mockResolvedValue({
        ...mockTransfer,
        status: TransferStatus.APPROVED,
      });

      const response = transfersService.processStatus(
        mockId,
        TransferStatus.APPROVED,
      );

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(transfersErrors.ALREADY_PROCESSED);
    });

    it('should throw an error when transfer status is REFUSED', () => {
      jest
        .spyOn(mockPrisma.transfer, 'findUnique')
        .mockResolvedValue({ ...mockTransfer, status: TransferStatus.REFUSED });

      const response = transfersService.processStatus(
        mockId,
        TransferStatus.APPROVED,
      );

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(transfersErrors.ALREADY_PROCESSED);
    });
  });
});
