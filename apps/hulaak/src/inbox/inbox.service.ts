import { Injectable } from '@nestjs/common';
import { Email } from '@prisma/client';
import { PrismaService } from '@rumsan/prisma';
import fs from 'fs';
import { simpleParser } from 'mailparser';
import path from 'path';

@Injectable()
export class InboxService {
  private emailDir = path.join('.data', 'emails');
  constructor(private prisma: PrismaService) {}

  async findByAddress(address: string): Promise<Email[]> {
    return this.prisma.email.findMany({
      where: { address },
    });
  }

  async findByDomain(domain: string): Promise<Email[]> {
    return this.prisma.email.findMany({
      where: { domain },
    });
  }

  async findByEmailCuid(mailCuid: string) {
    const rawEmailFilePath = path.join(this.emailDir, `${mailCuid}.eml`);
    const email = fs.readFileSync(rawEmailFilePath, 'utf8');

    return simpleParser(email);
  }

  countAll(): Promise<number> {
    return this.prisma.email.count();
  }

  async removeByEmailCuid(mailCuid: string): Promise<{ count: number }> {
    const rawEmailFilePath = path.join(this.emailDir, `${mailCuid}.eml`);
    fs.unlinkSync(rawEmailFilePath);

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

  removeAll(): Promise<{ count: number }> {
    fs.readdirSync(this.emailDir).forEach((file) => {
      fs.unlinkSync(path.join(this.emailDir, file));
    });

    return this.prisma.email.deleteMany({});
  }
}
