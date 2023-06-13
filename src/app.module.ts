import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HoldersModule } from './holders/holders.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [AuthModule, HoldersModule, AccountsModule, TransfersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
