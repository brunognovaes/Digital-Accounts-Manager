import { Account } from '@prisma/client';
import { FilterQueryDto } from 'src/common/dtos/filter-query.dto';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { UpdateAccountDto } from './dtos/update-account.dto';

export interface IListAccountsFilterQuery extends FilterQueryDto {
  holderId?: string
}

export interface IUpdateBalanceReturn {
  accountId: string;
  oldBalance: number;
  newBalance: number;
}

export interface IAccountsService {
  create(holderId: string): Promise<Account>;
  list(queries: IListAccountsFilterQuery): Promise<IPaginatedResponse<Account>>;
  getById(id: string): Promise<Account>;
  cashIn(accountId: string, amount: number): Promise<IUpdateBalanceReturn>;
  cashOut(accountId: string, amount: number): Promise<IUpdateBalanceReturn>;
  updateConfigs(data: UpdateAccountDto, accountId: string): Promise<Account>;
}
