import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { InboxService } from './inbox.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('inbox')
@ApiTags('inbox')
export class InboxController {
  constructor(private readonly inbox: InboxService) {}

  @Get()
  countAll() {
    return this.inbox.countAll();
  }

  @Delete()
  removeAll(@Query('filter') filter: 'unread' | 'all') {
    if (filter !== 'unread' && filter !== 'all') {
      throw new BadRequestException(
        `Invalid filter: ${filter}. Allowed filters are 'unread' or 'all'.`
      );
    }

    return this.inbox.removeBulk(filter);
  }

  @Get('domains/:domain')
  findByDomain(@Param('domain') domain: string) {
    return this.inbox.findByDomain(domain);
  }

  @Delete('domains/:domain')
  removeByDomain(@Param('domain') domain: string) {
    return this.inbox.removeByDomain(domain);
  }

  @Get(':address')
  findByAddress(@Param('address') address: string) {
    return this.inbox.findByAddress(address);
  }

  @Delete(':address')
  removeByAddress(@Param('address') address: string) {
    return this.inbox.removeByAddress(address);
  }
}
