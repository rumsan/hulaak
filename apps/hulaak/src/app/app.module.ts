import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SmtpService } from '../smtp/smtp.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, SmtpService],
})
export class AppModule {}
