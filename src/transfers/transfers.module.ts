import { Module } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  providers: [TransfersService, PrismaService, AuthService, AccountsService],
  controllers: [TransfersController],
})
export class TransfersModule {}
