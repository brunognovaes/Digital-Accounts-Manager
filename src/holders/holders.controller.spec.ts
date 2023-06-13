import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { HoldersController } from './holders.controller';
import { HoldersService } from './holders.service';

const mockName = 'name';
const mockDocument = 'document';
const mockId = 'uuid';
const mockPass = 'pass'
const mockHolder = {
  id: mockId,
  name: mockName,
  document: mockDocument,
  created_at: '01-01-01T00:00:00Z',
  updated_at: '01-01-01T00:00:00Z',
};

const mockHoldersService = {
  delete: jest.fn().mockImplementation(async () => mockHolder),
  getByDocument: jest.fn().mockImplementation(async () => mockHolder),
  getById: jest.fn().mockImplementation(async () => mockHolder),
  create: jest.fn().mockImplementation(async () => mockHolder)
}

const mockUser = 'user';
const mockHash = 'hash';
const mockCredential = {
  id: 'uuid',
  user: mockUser,
  hash: mockHash,
  created_at: '01-01-01T00:00:00Z',
  updated_at: '01-01-01T00:00:00Z',
};


const mockAuthService = {
  signIn: jest.fn().mockImplementation(async () => null),
  delete: jest.fn().mockImplementation(async () => mockCredential)
}

describe('HoldersController', () => {
  let holdersController: HoldersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoldersController],
      providers: [
        {
          provide: HoldersService,
          useValue: mockHoldersService
        },
        {
          provide: AuthService,
          useValue: mockAuthService
        }
    ]
    }).compile();

    holdersController = module.get<HoldersController>(HoldersController);
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(holdersController).toBeDefined();
  });

  describe('create', () => {
    it('should create a holder and a credential successfully', async () => {
      const response = await holdersController.create({
        document: mockDocument,
        name: mockName,
        password: mockPass
      })

      expect(response).toBeDefined()
      expect(response).toEqual(mockHolder)
      expect(mockHoldersService.create).toHaveBeenCalledTimes(1)
      expect(mockAuthService.signIn).toHaveBeenCalledTimes(1)
    })
  })

  describe('delete', () => {
    it('should delete holder successfully', async () => {
      const response = await holdersController.delete(mockId)

      expect(response).not.toBeDefined()
      expect(mockAuthService.delete).toHaveBeenCalledTimes(1)
      expect(mockHoldersService.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('getByDocument', () => {
    it('should return holder by document successfully', async () => {
      const response = await holdersController.getByDocument(mockDocument)
  
      expect(response).toBeDefined()
      expect(response).toEqual(mockHolder)
      expect(mockHoldersService.getByDocument).toHaveBeenCalledTimes(1)
    })
  })

  describe('getById', () => {
    it('should return holder by id successfully', async () => {
      const response = await holdersController.getById(mockId)
  
      expect(response).toBeDefined()
      expect(response).toEqual(mockHolder)
      expect(mockHoldersService.getById).toHaveBeenCalledTimes(1)
    })
  })
  

});
