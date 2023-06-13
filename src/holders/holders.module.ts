import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { HoldersController } from './holders.controller';
import { HoldersService } from './holders.service';

@Module({
  providers: [HoldersService, PrismaService],
  controllers: [HoldersController]
})
export class HoldersModule {}
