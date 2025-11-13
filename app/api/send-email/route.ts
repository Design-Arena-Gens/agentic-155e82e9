import { NextRequest } from 'next/server';
import { generateEmailFromTopic } from '@/lib/gemini';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { recipient_email, email_topic } = await req.json();
    if (!recipient_email || !email_topic) {
      return new Response(JSON.stringify({ error: 'recipient_email and email_topic are required' }), { status: 400 });
    }

    const generated = await generateEmailFromTopic(String(email_topic));
    const sendResult = await sendEmail({ to: String(recipient_email), subject: generated.subject, body: generated.body });

    return new Response(JSON.stringify({ subject: generated.subject, body: generated.body, sent: sendResult.sent, error: sendResult.sent ? undefined : sendResult.reason }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    const message = err?.message ?? 'Internal error';
    return new Response(JSON.stringify({ subject: '', body: '', sent: false, error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
