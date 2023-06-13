import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';

@Module({
  providers: [TransfersService]
})
export class TransfersModule {}
