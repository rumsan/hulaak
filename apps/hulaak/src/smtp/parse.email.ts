import { AddressObject, simpleParser } from 'mailparser';
import { SMTPServerDataStream } from 'smtp-server';

export const parseEmail = async (email: SMTPServerDataStream) => {
  const parsed = await simpleParser(email);
  const to = parsed?.to as AddressObject;
  const addresses = to.value.map((email) => email.address);

  return {
    parsed,
    addresses,
    subject: parsed.subject,
    from: parsed.from?.value?.[0]?.address,
    date: parsed.date,
  };
};
