import { Module } from '@nestjs/common';

import { PrismaModule } from '@rumsan/prisma';
import { InboxModule } from '../inbox/inbox.module';
import { SettingsModule } from '../settings/settings.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [PrismaModule, SettingsModule, InboxModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
