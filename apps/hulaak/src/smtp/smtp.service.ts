import { Injectable, OnModuleInit } from '@nestjs/common';
import { SMTPServer } from 'smtp-server';
import { simpleParser, ParsedMail } from 'mailparser';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SmtpService implements OnModuleInit {
  private server: SMTPServer;
  private emailDir = path.join('.data', 'emails');

  onModuleInit() {
    this.startSmtpServer();
  }

  private startSmtpServer() {
    this.server = new SMTPServer({
      disabledCommands: ['AUTH', 'STARTTLS'], // Disable authentication and TLS
      onData: (stream, session, callback) => {
        this.parseEmail(stream)
          .then((parsed) => {
            // Ensure .data directory and emails subfolder exist
            this.ensureDirectoryExists(this.emailDir);

            // Safely handle parsed.to (ensure it's an array)
            const toRecipients = Array.isArray(parsed.to)
              ? parsed.to.map((recipient) => recipient.text)
              : parsed.to?.text
              ? [parsed.to.text]
              : [];

            // Extract headers, body, and other details
            const emailData = {
              ID: `${Date.now()}_email`, // Custom ID
              From: parsed.from?.text,
              To: toRecipients,
              Subject: parsed.subject,
              Date: parsed.date,
              Headers: parsed.headers,
              Body: parsed.text, // Plain text version of the email body
              HtmlBody: parsed.html, // HTML version of the email body
              Raw: {
                From: parsed.from?.text,
                To: toRecipients,
                Data: parsed.textAsHtml, // Raw text as HTML
                Helo: session.helo, // Session Helo information
              },
            };

            // Save email as JSON
            const emailFilePath = path.join(
              this.emailDir,
              `${Date.now()}_email.json`
            );
            fs.writeFileSync(emailFilePath, JSON.stringify(emailData, null, 2));
            console.log('Email saved:', emailFilePath);

            callback();
          })
          .catch((err) => {
            console.error('Error parsing email:', err);
            callback(err);
          });
      },
    });

    this.server.listen(25, '0.0.0.0', () => {
      console.log('SMTP Server listening on port 25 without TLS');
    });
  }

  private ensureDirectoryExists(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log('Directory created:', dir);
    }
  }

  async parseEmail(stream): Promise<ParsedMail> {
    return new Promise((resolve, reject) => {
      simpleParser(stream, (err, parsed) => {
        if (err) {
          reject(err);
        } else {
          resolve(parsed);
        }
      });
    });
  }
}
