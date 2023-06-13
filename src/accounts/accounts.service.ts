import { Inject, Injectable } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { PrismaService } from 'src/prisma.service';
import accountsErrors from './accounts.errors';
import {
  IAccountsService,
  IListAccountsFilterQuery,
  IUpdateBalanceReturn,
} from './accounts.interfaces';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { accountNumberGenerator } from './utils/account-number-generator.util';
import { DEFAULT_BRANCH } from './utils/index.util';

@Injectable()
export class AccountsService implements IAccountsService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  create(holderId: string): Promise<Account> {
    const accountLength = 10;
    const accountNumber = accountNumberGenerator(accountLength);

    return this.prismaService.account.create({
      data: {
        holder_id: holderId,
        balance: new Prisma.Decimal(0),
        branch: DEFAULT_BRANCH,
        number: accountNumber,
        active: true,
        blocked: false,
      },
    });
  }

  async list(
    queries: IListAccountsFilterQuery,
  ): Promise<IPaginatedResponse<Account>> {
    const orderBy = {
      created_at: queries.order,
    };
    const skip = queries.itemsPerPage * queries.page;
    const take = queries.itemsPerPage;
    const gte = new Date(queries.startDate);
    const lte = new Date(new Date(queries.endDate).setUTCHours(23, 59, 59, 59));
    const where = {
      created_at: {
        ...(queries.startDate && { gte }),
        ...(queries.endDate && { lte }),
      },
      ...(queries.holderId && { holder_id: queries.holderId }),
    };

    const maxItems = await this.prismaService.account.count({
      where,
    });
    const maxPage = Math.floor(maxItems / queries.itemsPerPage);

    const accounts = await this.prismaService.account.findMany({
      where,
      skip,
      orderBy,
      take,
    });

    return {
      values: accounts,
      metadata: {
        currentItems: accounts.length,
        maxPage,
        order: queries.order,
        page: queries.page,
      },
    };
  }

  async getById(id: string): Promise<Account> {
    const account = await this.prismaService.account.findUnique({
      where: {
        id,
      },
    });

    if (!account) {
      throw accountsErrors.NOT_FOUND;
    }

    return account;
  }

  async cashIn(
    accountId: string,
    amount: number,
  ): Promise<IUpdateBalanceReturn> {
    const account = await this.getById(accountId);

    if (!account.active) {
      throw accountsErrors.INACTIVE;
    }

    if (account.blocked) {
      throw accountsErrors.BLOCKED;
    }

    const oldBalance = account.balance.toNumber();
    const newBalance = +(oldBalance + amount).toFixed(2);

    await this.prismaService.account.update({
      where: {
        id: accountId,
      },
      data: {
        balance: newBalance,
      },
    });

    return {
      accountId,
      newBalance,
      oldBalance,
    };
  }

  async cashOut(
    accountId: string,
    amount: number,
  ): Promise<IUpdateBalanceReturn> {
    const account = await this.getById(accountId);

    if (!account.active) {
      throw accountsErrors.INACTIVE;
    }

    if (account.blocked) {
      throw accountsErrors.BLOCKED;
    }

    const oldBalance = account.balance.toNumber();

    if (oldBalance < amount) {
      throw accountsErrors.NOT_ENOUGH_BALANCE;
    }

    const newBalance = +(oldBalance - amount).toFixed(2);

    await this.prismaService.account.update({
      where: {
        id: accountId,
      },
      data: {
        balance: newBalance,
      },
    });

    return {
      accountId,
      newBalance,
      oldBalance,
    };
  }

  async updateConfigs(
    data: UpdateAccountDto,
    accountId: string,
  ): Promise<Account> {
    const account = await this.getById(accountId);

    if (!account.active) {
      throw accountsErrors.INACTIVE;
    }

    return this.prismaService.account.update({
      where: {
        id: accountId,
      },
      data: {
        ...(data.active !== null && { active: data.active }),
        ...(data.blocked !== null && { blocked: data.blocked }),
      },
    });
  }
}
