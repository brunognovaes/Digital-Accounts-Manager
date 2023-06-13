import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
