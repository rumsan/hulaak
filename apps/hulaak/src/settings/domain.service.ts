import { Injectable, Logger } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Injectable()
export class DomainService {
  private readonly logger = new Logger(DomainService.name);

  constructor(private readonly settings: SettingsService) {}

  async add(domains: string[]) {
    let allDomains: string[] = (await this.settings.get('domains')) || [];
    allDomains = [...new Set([...allDomains, ...domains])];
    if (allDomains.includes('*')) {
      allDomains = ['*'];
    }
    return this.settings.save('domains', allDomains, false);
  }

  async list(): Promise<string[]> {
    const domains = (await this.settings.get('domains')) || [];
    return domains as string[];
  }

  async remove(domains: string[]) {
    if (domains.includes('*')) {
      return this.settings.save('domains', [], false);
    }
    let allDomains: string[] = (await this.settings.get('domains')) || [];
    allDomains = allDomains.filter((domain) => !domains.includes(domain));
    return this.settings.save('domains', allDomains, false);
  }
}
