import { AddressObject, simpleParser } from 'mailparser';
import { SMTPServerDataStream } from 'smtp-server';
import { load } from 'cheerio';

export const parseEmail = async (email: SMTPServerDataStream) => {
  const parsed = await simpleParser(email);
  const to = parsed?.to as AddressObject;
  const addresses = to.value.map((email) => email.address);

  let text = parsed.text?.trim();
  if (!text) {
    const $ = load(parsed.html?.toString() || 'ERROR: NO DATA');
    text = $.text();
  }

  return {
    parsed,
    addresses,
    subject: parsed.subject,
    from: parsed.from?.value?.[0]?.address,
    date: parsed.date,
    text,
  };
};
