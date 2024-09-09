import { Controller, Delete, Get, Param } from '@nestjs/common';
import { InboxService } from './inbox.service';

@Controller('inbox')
export class InboxController {
  constructor(private readonly emailService: InboxService) {}

  @Get()
  countAll() {
    return this.emailService.countAll();
  }

  @Delete()
  removeAll() {
    return this.emailService.removeAll();
  }

  @Get('domains/:domain')
  findByDomain(@Param('domain') domain: string) {
    return this.emailService.findByDomain(domain);
  }

  @Delete('domains/:domain')
  removeByDomain(@Param('domain') domain: string) {
    return this.emailService.removeByDomain(domain);
  }

  @Get('email/:cuid')
  GetOne(@Param('cuid') cuid: string) {
    return this.emailService.findByEmailCuid(cuid);
  }

  @Delete('email/:cuid')
  remove(@Param('cuid') cuid: string) {
    return this.emailService.removeByEmailCuid(cuid);
  }

  @Get(':address')
  findByAddress(@Param('address') address: string) {
    return this.emailService.findByAddress(address);
  }

  @Delete(':address')
  removeByAddress(@Param('address') address: string) {
    return this.emailService.removeByAddress(address);
  }
}
