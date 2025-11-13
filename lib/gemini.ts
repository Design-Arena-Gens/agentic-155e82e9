import { GoogleGenerativeAI } from "@google/generative-ai";

export type GeneratedEmail = { subject: string; body: string };

const SYSTEM_INSTRUCTION = `You are a professional email assistant.
Based on the provided topic or instruction, draft a concise, high-quality email.
Respond ONLY in minified JSON with keys: subject (string) and body (string).
The body should be natural, friendly-professional, and formatted in plain text.
Do not include salutations if the topic requests just a quick note; otherwise include them.`;

function getClient() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY environment variable");
  }
  return new GoogleGenerativeAI(apiKey);
}

export async function generateEmailFromTopic(topic: string): Promise<GeneratedEmail> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `${SYSTEM_INSTRUCTION}\n\nTOPIC:\n${topic}`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed.subject === 'string' && typeof parsed.body === 'string') {
      return { subject: parsed.subject, body: parsed.body };
    }
  } catch (_) {
    // fallthrough to heuristic parsing
  }
  // heuristic fallback: split first line as subject
  const lines = text.split(/\n+/);
  const subject = (lines[0] || 'Subject').replace(/^Subject:?\s*/i, '').slice(0, 120);
  const body = lines.slice(1).join('\n').trim() || text;
  return { subject, body };
}
