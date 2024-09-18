import { Module } from '@nestjs/common';

import { PrismaModule } from '@rumsan/prisma';
import { InboxModule } from '../inbox/inbox.module';
import { SettingsModule } from '../settings/settings.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '../core/core.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, InboxModule, EmailModule, SettingsModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
