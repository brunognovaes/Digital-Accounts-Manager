import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Holder } from '@prisma/client';
import { IAuthService } from 'src/auth/auth.interfaces';
import { AuthService } from 'src/auth/auth.service';
import { CreateHolderDto } from './dtos/create-holder.dto';
import { IHoldersController, IHoldersService } from './holders.interfaces';
import { HoldersService } from './holders.service';

@Controller('holders')
export class HoldersController implements IHoldersController {
  constructor(
    @Inject(HoldersService) private holdersService: IHoldersService,
    @Inject(AuthService) private authService: IAuthService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateHolderDto): Promise<Holder> {
    await this.authService.signIn(data.document, data.password);
    delete data.password;

    return this.holdersService.create(data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<Holder> {
    return this.holdersService.getById(id);
  }

  @Get('document/:document')
  @HttpCode(HttpStatus.OK)
  getByDocument(@Param('document') document: string): Promise<Holder> {
    return this.holdersService.getByDocument(document);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const holder = await this.holdersService.delete(id);
    await this.authService.delete(holder.document);
  }
}
