import { Module } from '@nestjs/common';

import { PrismaModule } from '@rumsan/prisma';
import { DomainService } from './domain.service';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [PrismaModule],
  controllers: [SettingsController],
  providers: [SettingsService, DomainService],
  exports: [SettingsService, DomainService],
})
export class SettingsModule {}
