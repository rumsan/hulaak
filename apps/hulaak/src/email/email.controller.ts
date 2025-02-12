import { Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('email')
@ApiTags('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('message/:mailCuid')
  GetbyMailCuid(@Param('mailCuid') cuid: string) {
    return this.emailService.findByEmailCuid(cuid);
  }

  @Get('message/:mailCuid/raw')
  GetRawbyMailCuid(@Param('mailCuid') cuid: string) {
    return this.emailService.getRawEmail(cuid);
  }

  @Delete('message/:mailCuid')
  removebyMailCuid(@Param('mailCuid') cuid: string) {
    return this.emailService.removeByEmailCuid(cuid);
  }

  @Get(':cuid')
  GetOne(@Param('cuid') cuid: string) {
    return this.emailService.getById(cuid);
  }

  @Put(':cuid/mark-as-read')
  MarkAsRead(@Param('cuid') cuid: string) {
    return this.emailService.markReadById(cuid);
  }

  @Delete(':cuid')
  remove(@Param('cuid') cuid: string) {
    return this.emailService.removeById(cuid);
  }
}
