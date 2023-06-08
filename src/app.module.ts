import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HoldersModule } from './holders/holders.module';

@Module({
  imports: [AuthModule, HoldersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
