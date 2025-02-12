import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMailDto } from './dtos/create-mail.dto';
import { InboxService } from './inbox.service';

@Controller('inbox')
@ApiTags('inbox')
export class InboxController {
  constructor(private readonly inbox: InboxService) {}

  @Get()
  countAll() {
    return this.inbox.countAll();
  }

  @Put()
  createEmail(@Body() createMailDto: CreateMailDto) {
    return this.inbox.createEmail(createMailDto);
  }

  @Delete()
  removeAll(@Query('filter') filter: 'unread' | 'all') {
    if (filter !== 'unread' && filter !== 'all') {
      throw new BadRequestException(
        `Invalid filter: ${filter}. Allowed filters are 'unread' or 'all'.`,
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
