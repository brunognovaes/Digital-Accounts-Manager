import { Module } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { HoldersController } from './holders.controller';
import { HoldersService } from './holders.service';

@Module({
  providers: [HoldersService, PrismaService, AuthService, AccountsService],
  controllers: [HoldersController],
  exports: [HoldersService],
})
export class HoldersModule {}
