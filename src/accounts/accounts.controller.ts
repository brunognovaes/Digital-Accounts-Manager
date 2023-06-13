import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Account } from '@prisma/client';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { IHoldersService } from 'src/holders/holders.interfaces';
import { HoldersService } from 'src/holders/holders.service';
import {
  IAccountsController,
  IAccountsService,
  IListAccountsFilterQuery,
} from './accounts.interfaces';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dtos/create-account.dto';

@Controller('accounts')
export class AccountsController implements IAccountsController {
  constructor(
    @Inject(AccountsService) private accountsService: IAccountsService,
    @Inject(HoldersService) private holdersService: IHoldersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() data: CreateAccountDto): Promise<Account> {
    const holder = await this.holdersService.getByDocument(data.document);

    return this.accountsService.create(holder.id);
  }

  @Get(':holderId')
  @HttpCode(HttpStatus.OK)
  list(
    @Query() queries: IListAccountsFilterQuery,
    @Param('holderId') holderId: string,
  ): Promise<IPaginatedResponse<Account>> {
    return this.accountsService.list({ ...queries, holderId });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getById(@Param('id') id: string): Promise<Account> {
    return this.accountsService.getById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  close(@Param('id') id: string): Promise<Account> {
    return this.accountsService.updateConfigs(
      {
        active: false,
      },
      id,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  block(id: string): Promise<Account> {
    return this.accountsService.updateConfigs(
      {
        blocked: true,
      },
      id,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  unblock(id: string): Promise<Account> {
    return this.accountsService.updateConfigs(
      {
        blocked: false,
      },
      id,
    );
  }
}
