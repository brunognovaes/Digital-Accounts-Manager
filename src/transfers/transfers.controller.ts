import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { Transfer, TransferStatus } from '@prisma/client';
import { IAccountsService } from 'src/accounts/accounts.interfaces';
import { AccountsService } from 'src/accounts/accounts.service';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { CreateTransferDto } from './dtos/create-transfer.dto';
import { IListTransfersFilterQuery, ITransfersController, ITransfersService } from './transfers.interfaces';
import { TransfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController implements ITransfersController {
  constructor(
    @Inject(TransfersService) private transfersService: ITransfersService,
    @Inject(AccountsService) private accountsService: IAccountsService
  ) {}

  @Get(':id')
  getById(@Param('id') id: string): Promise<Transfer> {
    return this.transfersService.getById(id)
  }

  @Get()
  list(@Query() queries: IListTransfersFilterQuery): Promise<IPaginatedResponse<Transfer>> {
    return this.transfersService.list(queries)
  }

  @Post()
  async create(@Body() data: CreateTransferDto): Promise<Transfer> {
    let transfer: Transfer
    let status: TransferStatus

    try {
      transfer = await this.transfersService.create(data)
  
      if (data.credit) {
        await this.accountsService.cashIn(data.accountId, data.amount)
      } else {
        await this.accountsService.cashOut(data.accountId, data.amount)
      }

      status = TransferStatus.APPROVED
    } catch (error) {
      console.log("TransfersController:create - ", error)
      
      status = TransferStatus.REFUSED
    }
    
    return this.transfersService.processStatus(transfer.id, status)
  }
}
