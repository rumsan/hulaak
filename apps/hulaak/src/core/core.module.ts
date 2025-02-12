import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { WebsocketService } from './websocket.service';

@Module({
  imports: [SettingsModule],
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class CoreModule {}
