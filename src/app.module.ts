import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccountsModule } from './accounts/accounts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HoldersModule } from './holders/holders.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [
    AuthModule,
    HoldersModule,
    AccountsModule,
    TransfersModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
