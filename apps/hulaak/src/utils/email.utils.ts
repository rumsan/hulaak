interface EmailAddress {
  relays: string | null;
  mailbox: string;
  domain: string;
  params: string;
}

export function extractEmailAddress(input: string): EmailAddress | null {
  // Remove any display name (e.g., "Test ss" <email@domain.com>)
  const emailRegex = /(?:.*<)?([\w.@]+)(?:>|\s|\?|$)/;
  const match = input.match(emailRegex);

  if (!match) {
    console.error('Invalid email format');
    return null;
  }

  const email = match[1];

  // Split the email into the parts before and after the last '@'
  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1) {
    console.error('Invalid email format');
    return null;
  }

  const domainAndParams = email.substring(atIndex + 1); // Everything after the last '@'
  const localPart = email.substring(0, atIndex); // Everything before the last '@'

  // Further split localPart by '@' to extract relays and mailbox
  const mailboxParts = localPart.split('@');
  const mailbox = mailboxParts.pop() || ''; // Last part is the mailbox
  const relays = mailboxParts.length > 0 ? mailboxParts.join('@') : null; // Remaining parts are relays

  // Check if there are query parameters (e.g., param1=value1)
  const [domain, params] = domainAndParams.split('?');

  return {
    relays,
    mailbox,
    domain: domain || '',
    params: params || '',
  };
}
