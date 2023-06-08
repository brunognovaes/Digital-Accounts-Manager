import { Test, TestingModule } from '@nestjs/testing';
import { HoldersService } from './holders.service';
import { AppError } from 'src/common/error/app.error';
import holdersErrors from './holders.errors';
import { PrismaService } from 'src/prisma.service';

const mockName = 'name';
const mockDocument = 'document';
const mockHolder = {
  id: 'uuid',
  name: mockName,
  document: mockDocument,
  created_at: '01-01-01T00:00:00Z',
  updated_at: '01-01-01T00:00:00Z',
};
const mockPrisma = {
  holder: {
    create: async () => mockHolder,
    findUnique: async () => mockHolder,
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
      jest
        .spyOn(mockPrisma.holder, 'findUnique')
        .mockImplementation(async () => null);

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
});
