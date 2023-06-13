import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Account } from '@prisma/client';
import { FilterQueryDto } from 'src/common/dtos/filter-query.dto';
import { IPaginatedResponse } from 'src/common/index.interfaces';
import { IHoldersService } from 'src/holders/holders.interfaces';
import { HoldersService } from 'src/holders/holders.service';
import {
  IAccountsController,
  IAccountsService,
  IFormatedAccountResponse,
} from './accounts.interfaces';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dtos/create-account.dto';

@Controller('accounts')
export class AccountsController implements IAccountsController {
  constructor(
    @Inject(AccountsService) private accountsService: IAccountsService,
    @Inject(HoldersService) private holdersService: IHoldersService,
  ) {}

  formatAccount(acc: Account): IFormatedAccountResponse {
    return {
      id: acc.id,
      holder_id: acc.holder_id,
      balance: acc.balance.toNumber(),
      number: acc.number,
      branch: acc.branch,
      active: acc.active,
      blocked: acc.blocked,
      created_at: acc.created_at,
      updated_at: acc.updated_at,
    };
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() data: CreateAccountDto,
  ): Promise<IFormatedAccountResponse> {
    const holder = await this.holdersService.getByDocument(data.document);

    const account = await this.accountsService.create(holder.id);

    return this.formatAccount(account);
  }

  @Get('holder/:holderId')
  @HttpCode(HttpStatus.OK)
  async list(
    @Query() queries: FilterQueryDto,
    @Param('holderId', ParseUUIDPipe) holderId: string,
  ): Promise<IPaginatedResponse<IFormatedAccountResponse>> {
    const response = await this.accountsService.list({ ...queries, holderId });
    const accounts = response.values.map((acc) => this.formatAccount(acc));

    return {
      metadata: response.metadata,
      values: accounts,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IFormatedAccountResponse> {
    const account = await this.accountsService.getById(id);

    return this.formatAccount(account);
  }

  @Patch('close/:id')
  @HttpCode(HttpStatus.OK)
  async close(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IFormatedAccountResponse> {
    const account = await this.accountsService.updateConfigs(
      {
        active: false,
      },
      id,
    );

    return this.formatAccount(account);
  }

  @Patch('block/:id')
  @HttpCode(HttpStatus.OK)
  async block(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IFormatedAccountResponse> {
    const account = await this.accountsService.updateConfigs(
      {
        blocked: true,
      },
      id,
    );

    return this.formatAccount(account);
  }

  @Patch('unblock/:id')
  @HttpCode(HttpStatus.OK)
  async unblock(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IFormatedAccountResponse> {
    const account = await this.accountsService.updateConfigs(
      {
        blocked: false,
      },
      id,
    );

    return this.formatAccount(account);
  }
}
