interface EmailAddress {
  Relays: string | null;
  Mailbox: string;
  Domain: string;
  Params: string;
}

interface EmailHeaders {
  [header: string]: string[];
}

interface EmailPart {
  Headers: EmailHeaders;
  Body: string;
  Size: number;
  MIME: EmailPart[] | null;
}

interface EmailContent {
  Headers: EmailHeaders;
  Body: string;
  Size: number;
  MIME: EmailPart[] | null;
}

interface RawEmailData {
  From: string;
  To: string[];
  Data: string;
  Helo: string;
}

export interface ParsedEmail {
  ID: string;
  From: EmailAddress;
  To: EmailAddress[];
  Content: EmailContent;
  Created: string;
  MIME: {
    Parts: EmailPart[];
  };
  Raw: RawEmailData;
}
