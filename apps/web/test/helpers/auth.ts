const MAILPIT_URL = process.env.MAILPIT_URL ?? "http://localhost:8026";

type MailpitMessage = {
  ID: string;
  To: Array<{ Address: string }>;
  Subject: string;
};

async function messages(): Promise<MailpitMessage[]> {
  const response = await fetch(`${MAILPIT_URL}/api/v1/messages`);
  const payload = (await response.json()) as { messages?: MailpitMessage[] };
  return payload.messages ?? [];
}

export async function waitForMail(email: string, subject: string): Promise<MailpitMessage> {
  const deadline = Date.now() + 15_000;

  while (Date.now() < deadline) {
    const found = (await messages()).find(
      (message) =>
        message.Subject.includes(subject) &&
        message.To.some((recipient) => recipient.Address === email),
    );

    if (found) {
      return found;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Mail not received for ${email}: ${subject}`);
}

export async function tokenFromMail(email: string, subject: string, path: string): Promise<string> {
  const message = await waitForMail(email, subject);
  const response = await fetch(`${MAILPIT_URL}/api/v1/message/${message.ID}`);
  const payload = (await response.json()) as { HTML?: string };
  const html = (payload.HTML ?? "").replaceAll("&#x3D;", "=");
  const match = html.match(new RegExp(`${path}\\?token=([A-Za-z0-9_-]+)`));

  if (!match?.[1]) {
    throw new Error(`Token not found in ${subject} mail`);
  }

  return match[1];
}

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

export const PASSWORD = "correct-horse-battery";
