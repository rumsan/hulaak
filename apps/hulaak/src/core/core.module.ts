import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { SmtpService } from './smtp.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  providers: [WebsocketService, SmtpService],
  exports: [WebsocketService, SmtpService],
})
export class CoreModule {}
