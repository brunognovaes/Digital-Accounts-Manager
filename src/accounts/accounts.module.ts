import { Module } from '@nestjs/common';
import { HoldersModule } from 'src/holders/holders.module';
import { PrismaService } from 'src/prisma.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  providers: [AccountsService, PrismaService],
  controllers: [AccountsController],
  imports: [HoldersModule],
  exports: [AccountsService],
})
export class AccountsModule {}
