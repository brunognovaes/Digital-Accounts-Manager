import { Transfer, TransferStatus } from '@prisma/client';
import { FilterQueryDto } from 'src/common/dtos/filter-query.dto';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { CreateTransferDto } from './dtos/create-transfer.dto';

export interface IListTransfersFilterQuery extends FilterQueryDto {
  accountId?: string;
}

export interface ITransfersService {
  create(data: CreateTransferDto): Promise<Transfer>;
  getById(id: string): Promise<Transfer>;
  list(
    queries: IListTransfersFilterQuery,
  ): Promise<IPaginatedResponse<Transfer>>;
  processStatus(id: string, status: TransferStatus): Promise<Transfer>;
}

export interface ITransfersController {
  create(data: CreateTransferDto): Promise<Transfer>;
  getById(id: string): Promise<Transfer>;
  list(
    queries: IListTransfersFilterQuery,
  ): Promise<IPaginatedResponse<Transfer>>;
}
