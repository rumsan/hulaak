import { Injectable } from '@nestjs/common';
import { Email } from '@prisma/client';
import { PrismaService } from '@rumsan/prisma';
import fs from 'fs';
import path from 'path';

@Injectable()
export class InboxService {
  private emailDir = path.join('.data', 'emails');
  constructor(private prisma: PrismaService) {}

  async findByAddress(address: string): Promise<Email[]> {
    return this.prisma.email.findMany({
      where: { address },
      orderBy: { date: 'desc' },
      take: 30,
    });
  }

  async findByDomain(domain: string): Promise<Email[]> {
    return this.prisma.email.findMany({
      where: { domain },
      orderBy: { date: 'desc' },
      take: 30,
    });
  }

  countAll(): Promise<number> {
    return this.prisma.email.count();
  }

  async removeByEmailCuid(mailCuid: string): Promise<{ count: number }> {
    try {
      const rawEmailFilePath = path.join(this.emailDir, `${mailCuid}.eml`);
      fs.unlinkSync(rawEmailFilePath);
    } catch (e) {}

    return this.prisma.email.deleteMany({
      where: { mailCuid },
    });
  }

  async removeByAddress(address: string): Promise<{ count: number }> {
    const emails = await this.prisma.email.findMany({
      where: { address },
    });
    emails.forEach((email) => {
      this.removeByEmailCuid(email.mailCuid);
    });

    return { count: emails.length };
  }

  async removeByDomain(domain: string): Promise<{ count: number }> {
    const emails = await this.prisma.email.findMany({
      where: { domain },
    });
    emails.forEach((email) => {
      this.removeByEmailCuid(email.mailCuid);
    });

    return { count: emails.length };
  }

  async removeBulk(filter: 'unread' | 'all'): Promise<{ count: number }> {
    this.prisma.log
      .deleteMany({
        where: {
          read: false,
        },
      })
      .then();

    if (filter === 'all') {
      fs.readdirSync(this.emailDir).forEach((file) => {
        fs.unlinkSync(path.join(this.emailDir, file));
      });

      return this.prisma.email.deleteMany({});
    } else if (filter === 'unread') {
      const emails = await this.prisma.email.findMany({
        where: { read: false },
      });
      emails.forEach((email) => {
        this.removeByEmailCuid(email.mailCuid);
      });

      return { count: emails.length };
    }
  }
}
