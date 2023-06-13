import { Transfer, TransferStatus } from '@prisma/client';
import { FilterQueryDto } from 'src/common/dtos/filter-query.dto';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { CreateTransferDto } from './dtos/create-transfer.dto';

export interface IListTransfersFilterQuery extends FilterQueryDto {
  accountId?: string;
}

export interface IFormatedTransferResponse {
  id: string;
  account_id: string;
  amount: number;
  credit: boolean;
  status: TransferStatus;
  message?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ITransfersService {
  create(data: CreateTransferDto): Promise<Transfer>;
  getById(id: string): Promise<Transfer>;
  list(
    queries: IListTransfersFilterQuery,
  ): Promise<IPaginatedResponse<Transfer>>;
  processStatus(
    id: string,
    status: TransferStatus,
    message?: string,
  ): Promise<Transfer>;
}

export interface ITransfersController {
  create(data: CreateTransferDto): Promise<IFormatedTransferResponse>;
  getById(id: string): Promise<IFormatedTransferResponse>;
  list(
    queries: FilterQueryDto,
    accountId: string,
  ): Promise<IPaginatedResponse<IFormatedTransferResponse>>;
  formatTransfer(transfer: Transfer): IFormatedTransferResponse;
}
