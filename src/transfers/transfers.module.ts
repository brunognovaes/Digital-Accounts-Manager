import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { PrismaService } from 'src/prisma.service';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  providers: [TransfersService, PrismaService],
  controllers: [TransfersController],
  imports: [AccountsModule]
})
export class TransfersModule {}
