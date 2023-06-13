import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Transfer, TransferStatus } from '@prisma/client';
import { IAccountsService } from 'src/accounts/accounts.interfaces';
import { AccountsService } from 'src/accounts/accounts.service';
import { FilterQueryDto } from 'src/common/dtos/filter-query.dto';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { CreateTransferDto } from './dtos/create-transfer.dto';
import {
  IFormatedTransferResponse,
  ITransfersController,
  ITransfersService,
} from './transfers.interfaces';
import { TransfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController implements ITransfersController {
  constructor(
    @Inject(TransfersService) private transfersService: ITransfersService,
    @Inject(AccountsService) private accountsService: IAccountsService,
  ) {}

  formatTransfer(tran: Transfer): IFormatedTransferResponse {
    return {
      id: tran.id,
      account_id: tran.account_id,
      amount: tran.amount.toNumber(),
      credit: tran.credit,
      status: tran.status,
      ...(tran.message && { message: tran.message }),
      created_at: tran.created_at,
      updated_at: tran.updated_at,
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<IFormatedTransferResponse> {
    const tran = await this.transfersService.getById(id);

    return this.formatTransfer(tran);
  }

  @Get('/account/:accountId')
  async list(
    @Query() queries: FilterQueryDto,
    @Param('accountId') accountId: string,
  ): Promise<IPaginatedResponse<IFormatedTransferResponse>> {
    const response = await this.transfersService.list({
      ...queries,
      accountId,
    });
    const transfers = response.values.map((tran) => this.formatTransfer(tran));

    return {
      metadata: response.metadata,
      values: transfers,
    };
  }

  @Post()
  async create(
    @Body() data: CreateTransferDto,
  ): Promise<IFormatedTransferResponse> {
    let transfer: Transfer;
    let status: TransferStatus;
    let message: string = null;

    try {
      transfer = await this.transfersService.create(data);

      if (data.credit) {
        await this.accountsService.cashIn(data.accountId, data.amount);
      } else {
        await this.accountsService.cashOut(data.accountId, data.amount);
      }

      status = TransferStatus.APPROVED;
    } catch (error) {
      console.log('TransfersController:create - ', error);

      status = TransferStatus.REFUSED;
      message = error.message;
    }

    const tran = await this.transfersService.processStatus(
      transfer.id,
      status,
      message,
    );

    return this.formatTransfer(tran);
  }
}
