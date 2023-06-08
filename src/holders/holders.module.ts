import { Module } from '@nestjs/common';
import { HoldersService } from './holders.service';

@Module({
  providers: [HoldersService]
})
export class HoldersModule {}
