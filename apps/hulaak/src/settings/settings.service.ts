import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async save<T>(name: string, data: T, isPrivate = true) {
    let value: string;
    try {
      value = JSON.stringify(data);
    } catch (e) {
      value = data.toString();
    }

    return this.prisma.setting.upsert({
      where: { name },
      update: { value, isPrivate },
      create: { name, value, isPrivate },
    });
  }

  async list() {
    return this.prisma.setting.findMany({
      where: { isPrivate: false },
    });
  }

  async get<T>(name: string): Promise<T> {
    const setting = await this.prisma.setting.findUnique({
      where: { name, isPrivate: false },
    });

    if (!setting) {
      return null;
    }

    try {
      return JSON.parse(setting.value) as T;
    } catch (e) {
      // In case value is not JSON, return it as is
      return setting.value as unknown as T;
    }
  }
}
