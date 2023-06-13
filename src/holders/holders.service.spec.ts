import { Test, TestingModule } from '@nestjs/testing';
import { AppError } from 'src/common/error/app.error';
import { PrismaService } from 'src/prisma.service';
import holdersErrors from './holders.errors';
import { HoldersService } from './holders.service';

const mockName = 'name';
const mockDocument = 'document';
const mockId = 'uuid';
const mockHolder = {
  id: mockId,
  name: mockName,
  document: mockDocument,
  created_at: '01-01-01T00:00:00Z',
  updated_at: '01-01-01T00:00:00Z',
};
const mockPrisma = {
  holder: {
    create: async () => mockHolder,
    findUnique: async () => mockHolder,
    delete: async () => mockHolder,
  },
};

describe('HoldersService', () => {
  let holdersService: HoldersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HoldersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    holdersService = module.get<HoldersService>(HoldersService);

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(holdersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a holder successfully', () => {
      jest.spyOn(mockPrisma.holder, 'findUnique').mockResolvedValue(null);

      const response = holdersService.create({
        document: mockDocument,
        name: mockName,
      });

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toBe(mockHolder);
    });

    it('should throw an error when document is already registered', () => {
      const response = holdersService.create({
        document: mockDocument,
        name: mockName,
      });

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(holdersErrors.ALREADY_REGISTERED);
    });
  });

  describe('getById', () => {
    it('should return a holder successfully', () => {
      const response = holdersService.getById(mockId);

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(mockHolder);
    });

    it('should throw an error when holder not found', () => {
      jest.spyOn(mockPrisma.holder, 'findUnique').mockResolvedValue(null);

      const response = holdersService.getById(mockId);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(holdersErrors.NOT_FOUND);
    });
  });

  describe('getByDocument', () => {
    it('should return a holder successfully', () => {
      const response = holdersService.getByDocument(mockDocument);

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(mockHolder);
    });

    it('should throw an error when holder not found', () => {
      jest.spyOn(mockPrisma.holder, 'findUnique').mockResolvedValue(null);

      const response = holdersService.getByDocument(mockDocument);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(holdersErrors.NOT_FOUND);
    });
  });

  describe('delete', () => {
    it('should delete a holder successfully', () => {
      const response = holdersService.delete(mockId);

      expect(response).resolves.toBeDefined();
      expect(response).resolves.toEqual(mockHolder)
    });

    it('should throw an error when holder not found', () => {
      jest.spyOn(mockPrisma.holder, 'findUnique').mockResolvedValue(null);

      const response = holdersService.delete(mockId);

      expect(response).rejects.toBeDefined();
      expect(response).rejects.toThrowError(AppError);
      expect(response).rejects.toEqual(holdersErrors.NOT_FOUND);
    });
  });
});
