import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { HoldersController } from './holders.controller';
import { HoldersService } from './holders.service';

@Module({
  providers: [HoldersService, PrismaService, AuthService],
  controllers: [HoldersController],
  exports: [HoldersService],
})
export class HoldersModule {}
