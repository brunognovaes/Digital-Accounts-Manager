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

export interface IAccountsController {
  create(data: CreateAccountDto): Promise<Account>;
  list(
    queries: FilterQueryDto,
    holderId: string,
  ): Promise<IPaginatedResponse<Account>>;
  getById(id: string): Promise<Account>;
  close(id: string): Promise<Account>;
  block(id: string): Promise<Account>;
  unblock(id: string): Promise<Account>;
}

export interface IAccountsService {
  create(holderId: string): Promise<Account>;
  list(queries: IListAccountsFilterQuery): Promise<IPaginatedResponse<Account>>;
  getById(id: string): Promise<Account>;
  cashIn(accountId: string, amount: number): Promise<IUpdateBalanceReturn>;
  cashOut(accountId: string, amount: number): Promise<IUpdateBalanceReturn>;
  updateConfigs(data: UpdateAccountDto, accountId: string): Promise<Account>;
}
