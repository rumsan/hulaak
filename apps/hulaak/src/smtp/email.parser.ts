import { AddressObject, ParsedMail, simpleParser } from 'mailparser';

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

function convertParsedMailToParsedEmail(parsed: ParsedMail): ParsedEmail {
  // Helper function to convert email addresses
  function convertEmailAddress(email: AddressObject): EmailAddress {
    const [mailbox, domain] = email.text.split('@');
    return {
      Relays: null,
      Mailbox: mailbox,
      Domain: domain,
      Params: '',
    };
  }

  // Handle single or array of addresses
  function convertAddresses(
    addresses: AddressObject | AddressObject[]
  ): EmailAddress[] {
    if (Array.isArray(addresses)) {
      return addresses.map(convertEmailAddress);
    } else if (addresses) {
      return [convertEmailAddress(addresses)];
    } else {
      return [];
    }
  }

  // Extract headers
  function extractHeaders(headers: any): EmailHeaders {
    const result: EmailHeaders = {};
    for (const [key, values] of Object.entries(headers)) {
      result[key] = Array.isArray(values) ? values : [values];
    }
    return result;
  }

  // Placeholder for MIME parts (assuming you need to handle them, adjust as necessary)
  function convertMIME(parts: any): EmailPart[] | null {
    if (!parts || parts.length === 0) return null;

    return parts.map((part: any) => ({
      Headers: extractHeaders(part.headers),
      Body: part.body || '',
      Size: part.body?.length || 0,
      MIME: convertMIME(part.parts),
    }));
  }

  return {
    ID: `${Date.now()}_email`, // Custom ID, adjust as needed
    From: convertEmailAddress(parsed.from),
    To: convertAddresses(parsed.to),
    Content: {
      Headers: extractHeaders(parsed.headers),
      Body: parsed.text || '',
      Size: (parsed.text || '').length,
      MIME: null, // No direct `parts` in ParsedMail, set to null or adjust if needed
    },
    Created: new Date().toISOString(),
    MIME: {
      Parts: [], // No direct `parts` in ParsedMail, set to empty array or adjust if needed
    },
    Raw: {
      From: parsed.from.text || '',
      To: parsed.to
        ? convertAddresses(parsed.to).map(
            (addr) => `${addr.Mailbox}@${addr.Domain}`
          )
        : [],
      Data: parsed.textAsHtml || '',
      Helo: '', // `Helo` data is not available from `mailparser`, add if needed
    },
  };
}

// Example usage with a parsed email
async function parseEmail(stream) {
  const parsed = await simpleParser(stream);

  // Convert parsed data to the custom type
  const parsedEmail: ParsedEmail = convertParsedMailToParsedEmail(parsed);
  //console.log(parsedEmail);
  return parsedEmail;
}
