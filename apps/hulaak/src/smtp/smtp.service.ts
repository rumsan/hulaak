import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { PrismaService } from '@rumsan/prisma';
import * as fs from 'fs';
import * as path from 'path';
import {
  SMTPServer,
  SMTPServerAddress,
  SMTPServerDataStream,
  SMTPServerSession,
} from 'smtp-server';
import { DomainService } from '../settings/domain.service';
import { extractEmailAddress } from '../utils/email.utils';
import { parseEmail } from './parse.email';

@Injectable()
export class SmtpService implements OnModuleInit {
  private readonly logger = new Logger(SmtpService.name);
  private server: SMTPServer;
  private emailDir = path.join('.data', 'emails');

  constructor(
    private readonly prisma: PrismaService,
    private readonly domainService: DomainService
  ) {}

  onModuleInit() {
    this.startSmtpServer();
  }

  private startSmtpServer() {
    this.server = new SMTPServer({
      disabledCommands: ['AUTH', 'STARTTLS'], // Disable authentication and TLS

      // Reject unapproved domains
      onMailFrom: async (
        address: SMTPServerAddress,
        session: SMTPServerSession,
        callback: (err?: Error | null) => void
      ) => {
        const senderDomain = address.address.split('@')[1];
        const approvedDomains = await this.domainService.list();
        if (approvedDomains.includes(senderDomain)) {
          callback();
        } else {
          callback(
            new Error(`Email rejected: Unapproved domain [${senderDomain}]`)
          );
        }
      },

      // Handle the incoming email data stream
      onData: (
        stream: SMTPServerDataStream,
        session: SMTPServerSession,
        callback
      ) => {
        const mailCuid = createId();
        const rawEmailFilePath = path.join(this.emailDir, `${mailCuid}.eml`);
        this.ensureDirectoryExists(this.emailDir);
        const writeStream = fs.createWriteStream(rawEmailFilePath);
        stream.pipe(writeStream);

        parseEmail(stream)
          .then(async ({ addresses, subject, date }) => {
            for (const address of addresses) {
              const email = extractEmailAddress(address);
              await this.prisma.email.create({
                data: {
                  mailCuid,
                  address,
                  mailbox: email?.mailbox || '',
                  domain: email?.domain || '',
                  subject,
                  date,
                },
              });
              this.logger.log(`Email received: ${address} - ${mailCuid}`);
            }
            callback();
          })
          .catch((err) => {
            console.error('Error parsing email:', err);
            callback(err);
          });

        writeStream.on('error', (err) => {
          console.error('Error writing raw email stream:', err);
          callback(err);
        });
      },
    });

    this.server.listen(25, '0.0.0.0', () => {
      this.logger.log('SMTP Server listening on port 25 without TLS');
    });
  }

  private ensureDirectoryExists(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log('Directory created:', dir);
    }
  }
}
