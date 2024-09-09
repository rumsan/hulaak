import { Module } from '@nestjs/common';

import { PrismaModule } from '@rumsan/prisma';
import { InboxModule } from '../inbox/inbox.module';
import { SettingsModule } from '../settings/settings.module';
import { SmtpService } from '../smtp/smtp.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [PrismaModule, SettingsModule, InboxModule],
  controllers: [AppController],
  providers: [AppService, SmtpService],
})
export class AppModule {}
