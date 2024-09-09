import { Module } from '@nestjs/common';
import { InboxController } from './inbox.controller';
import { InboxService } from './inbox.service';

@Module({
  imports: [],
  controllers: [InboxController],
  providers: [InboxService],
})
export class InboxModule {}
