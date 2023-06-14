import { Inject, Injectable } from '@nestjs/common';
import { Prisma, Transfer, TransferStatus } from '@prisma/client';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { PrismaService } from 'src/prisma.service';
import { CreateTransferDto } from './dtos/create-transfer.dto';
import transfersErrors from './transfers.errors';
import {
  IListTransfersFilterQuery,
  ITransfersService,
} from './transfers.interfaces';

@Injectable()
export class TransfersService implements ITransfersService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  create(data: CreateTransferDto): Promise<Transfer> {
    return this.prismaService.transfer.create({
      data: {
        amount: data.amount,
        credit: data.credit,
        status: TransferStatus.PENDING,
        account_id: data.accountId,
      },
    });
  }

  async getById(id: string): Promise<Transfer> {
    const transfer = await this.prismaService.transfer.findUnique({
      where: {
        id,
      },
    });

    if (!transfer) {
      throw transfersErrors.NOT_FOUND;
    }

    return transfer;
  }

  async list(
    queries: IListTransfersFilterQuery,
  ): Promise<IPaginatedResponse<Transfer>> {
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
      ...(queries.accountId && { account_id: queries.accountId }),
    };

    const maxItems = await this.prismaService.transfer.count({
      where,
    });
    const maxPage = Math.floor(maxItems / queries.itemsPerPage);

    const transfers = await this.prismaService.transfer.findMany({
      where,
      skip,
      orderBy,
      take,
    });

    return {
      values: transfers,
      metadata: {
        currentItems: transfers.length,
        maxPage,
        order: queries.order,
        page: queries.page,
      },
    };
  }

  async processStatus(
    id: string,
    status: TransferStatus,
    message?: string,
  ): Promise<Transfer> {
    const transfer = await this.getById(id);

    if (transfer.status !== TransferStatus.PENDING) {
      throw transfersErrors.ALREADY_PROCESSED;
    }

    return this.prismaService.transfer.update({
      where: {
        id: id,
      },
      data: {
        status,
        ...(message && { message }),
      },
    });
  }

  async getDailyTotalByAccount(accountId: string): Promise<Prisma.Decimal> {
    const startDay = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

    const result = await this.prismaService.transfer.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        account_id: accountId,
        credit: false,
        status: {
          in: [TransferStatus.APPROVED, TransferStatus.PENDING],
        },
        created_at: {
          gte: startDay,
        },
      },
    });

    return result._sum.amount || new Prisma.Decimal(0);
  }
}
