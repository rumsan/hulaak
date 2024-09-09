import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { DomainService } from './domain.service';
import { SettingsService } from './settings.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('settings')
@ApiTags('settings')
export class SettingsController {
  private readonly logger = new Logger(SettingsController.name);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly domainService: DomainService
  ) {}

  @Get()
  async list() {
    return this.settingsService.list();
  }

  @Post('domains')
  async addDomains(@Body() domains: string[]) {
    return this.domainService.add(domains);
  }

  @Get('domains')
  async listDomains() {
    return this.domainService.list();
  }

  @Delete('domains')
  async removeDomains(@Body() domains: string[]) {
    return this.domainService.remove(domains);
  }

  @Post(':name')
  async save(
    @Param('name') name: string,
    @Body() data: { value: any; isPrivate: boolean }
  ) {
    return this.settingsService.save(name, data.value, data.isPrivate);
  }

  @Get(':name')
  async get(@Param('name') name: string) {
    return this.settingsService.get(name);
  }
}
