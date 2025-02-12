import { Injectable, Logger } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { Email } from '@prisma/client';
import { PrismaService } from '@rumsan/prisma';
import fs from 'fs';
import path from 'path';
import { WebsocketService } from '../core/websocket.service';
import { DomainService } from '../settings/domain.service';
import { extractEmailAddress } from '../utils/email.utils';
import { CreateMailDto } from './dtos/create-mail.dto';

@Injectable()
export class InboxService {
  private readonly logger = new Logger(InboxService.name);
  private emailDir = path.join('.data', 'emails');

  constructor(
    private prisma: PrismaService,
    private readonly domainService: DomainService,
    private readonly ws: WebsocketService,
  ) {}

  async findByAddress(address: string): Promise<Email[]> {
    const email = extractEmailAddress(address);
    return this.prisma.email.findMany({
      where: { mailbox: email?.mailbox, domain: email?.domain },
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
    } catch (e) {
      this.logger.error(`Error deleting email file: ${mailCuid}`);
    }

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

  async createEmail(dto: CreateMailDto) {
    const { date, from, to, subject, html, text, raw } = dto;
    const addresses = to.split(',').map((address) => address.trim());

    console.log('Email received:', subject);

    const mailCuid = createId();
    const rawEmailFilePath = path.join(this.emailDir, `${mailCuid}.eml`);
    this.ensureDirectoryExists(this.emailDir);
    fs.writeFileSync(rawEmailFilePath, raw);

    for (const address of addresses) {
      const email = extractEmailAddress(address);
      //filter domains
      const approvedDomains = await this.domainService.list();
      if (approvedDomains.includes(email?.domain)) {
        const data = {
          id: createId(),
          mailCuid,
          address,
          mailbox: email?.mailbox || '',
          domain: email?.domain || '',
          from,
          subject,
          date,
          text,
          html,
        };
        await this.prisma.email.create({
          data,
        });

        await this.prisma.log.create({
          data: {
            id: data.id,
            mailbox: data.mailbox,
            domain: data.domain,
            mailCuid: data.mailCuid,
            from: data.from,
            subject: data.subject,
            text: data.text,
            date: data.date,
          },
        });

        this.ws.broadcast('new-email', data);
        this.logger.log(`Email received: ${address} - ${mailCuid}`);
      }
    }
    return addresses;
  }

  private ensureDirectoryExists(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log('Directory created:', dir);
    }
  }
}
