import { Module } from '@nestjs/common';
import { WebsocketService } from '../core/websocket.service';
import { DomainService } from '../settings/domain.service';
import { SettingsService } from '../settings/settings.service';
import { InboxController } from './inbox.controller';
import { InboxService } from './inbox.service';

@Module({
  imports: [],
  controllers: [InboxController],
  providers: [InboxService, WebsocketService, DomainService, SettingsService],
})
export class InboxModule {}
