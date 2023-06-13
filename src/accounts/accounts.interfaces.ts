import { Account } from '@prisma/client';
import { FilterQueryDto } from 'src/common/dtos/filter-query.dto';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';

export interface IListAccountsFilterQuery extends FilterQueryDto {
  holderId?: string;
}

export interface IUpdateBalanceReturn {
  accountId: string;
  oldBalance: number;
  newBalance: number;
}

export interface IFormatedAccountResponse {
  id: string;
  holder_id: string;
  number: string;
  branch: string;
  balance: number;
  active: boolean;
  blocked: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IAccountsController {
  create(data: CreateAccountDto): Promise<IFormatedAccountResponse>;
  list(
    queries: FilterQueryDto,
    holderId: string,
  ): Promise<IPaginatedResponse<IFormatedAccountResponse>>;
  getById(id: string): Promise<IFormatedAccountResponse>;
  close(id: string): Promise<IFormatedAccountResponse>;
  block(id: string): Promise<IFormatedAccountResponse>;
  unblock(id: string): Promise<IFormatedAccountResponse>;
}

export interface IAccountsService {
  create(holderId: string): Promise<Account>;
  list(queries: IListAccountsFilterQuery): Promise<IPaginatedResponse<Account>>;
  getById(id: string): Promise<Account>;
  cashIn(accountId: string, amount: number): Promise<IUpdateBalanceReturn>;
  cashOut(accountId: string, amount: number): Promise<IUpdateBalanceReturn>;
  updateConfigs(data: UpdateAccountDto, accountId: string): Promise<Account>;
}
