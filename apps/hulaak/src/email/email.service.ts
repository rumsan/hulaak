import { Injectable } from '@nestjs/common';
import { Email } from '@prisma/client';
import { PrismaService } from '@rumsan/prisma';
import fs from 'fs';
import { simpleParser } from 'mailparser';
import path from 'path';

@Injectable()
export class EmailService {
  private emailDir = path.join('.data', 'emails');
  constructor(private prisma: PrismaService) {}

  async findByEmailCuid(mailCuid: string) {
    const rawEmailFilePath = path.join(this.emailDir, `${mailCuid}.eml`);
    const email = fs.readFileSync(rawEmailFilePath, 'utf8');

    return simpleParser(email);
  }

  async getRawEmail(mailCuid: string) {
    const rawEmailFilePath = path.join(this.emailDir, `${mailCuid}.eml`);
    const email = fs.readFileSync(rawEmailFilePath, 'utf8');

    return email;
  }

  async removeByEmailCuid(mailCuid: string): Promise<{ count: number }> {
    const rawEmailFilePath = path.join(this.emailDir, `${mailCuid}.eml`);
    fs.unlinkSync(rawEmailFilePath);

    return this.prisma.email.deleteMany({
      where: { mailCuid },
    });
  }

  async getById(id: string) {
    const email = await this.prisma.email.findUnique({ where: { id } });
    const message = await this.findByEmailCuid(email.mailCuid);
    return { ...email, message };
  }

  async markReadById(id: string) {
    const email = await this.prisma.email.update({
      where: {
        id,
      },
      data: {
        read: true,
      },
    });

    this.prisma.log
      .updateMany({
        where: {
          id,
        },
        data: {
          read: true,
        },
      })
      .then();

    return email;
  }

  async removeById(id: string): Promise<{ count: number }> {
    const email = await this.prisma.email.findUnique({ where: { id } });
    if (!email) {
      return { count: 0 };
    }

    const numRecipients = await this.prisma.email.count({
      where: {
        mailCuid: email.mailCuid,
      },
    });

    if (numRecipients === 1) {
      await this.prisma.email.delete({ where: { id } });
      return { count: 1 };
    }
    return this.removeByEmailCuid(email.mailCuid);
  }
}
