"use client";

import { useCallback, useState } from "react";

export default function Page() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailTopic, setEmailTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    subject: string;
    body: string;
    sent: boolean;
    error?: string;
  }>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_email: recipientEmail, email_topic: emailTopic })
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ subject: "", body: "", sent: false, error: err?.message ?? String(err) });
    } finally {
      setLoading(false);
    }
  }, [recipientEmail, emailTopic]);

  return (
    <main>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Recipient email</span>
          <input
            type="email"
            required
            placeholder="recipient@example.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #27304a', background: '#0f1630', color: '#e7e9ee' }}
          />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Email topic / instruction</span>
          <textarea
            required
            placeholder="e.g. Send a follow-up about our meeting"
            rows={6}
            value={emailTopic}
            onChange={(e) => setEmailTopic(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #27304a', background: '#0f1630', color: '#e7e9ee' }}
          />
        </label>
        <button disabled={loading} type="submit" style={{
          padding: '12px 14px', borderRadius: 10, border: '1px solid #33406a', background: loading ? '#1a2344' : '#1f2a52', color: '#e7e9ee', cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Working?' : 'Generate and Send'}
        </button>
      </form>

      {result && (
        <section style={{ marginTop: 24, padding: 16, border: '1px solid #27304a', borderRadius: 12, background: '#0f1630' }}>
          {result.error && (
            <div style={{ color: '#ff6b6b', marginBottom: 12 }}>Error: {result.error}</div>
          )}
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ opacity: 0.8, fontSize: 12 }}>Subject</div>
            <div style={{ fontWeight: 600 }}>{result.subject || '?'}</div>
            <div style={{ opacity: 0.8, fontSize: 12, marginTop: 12 }}>Body</div>
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{result.body || '?'}</pre>
            <div style={{ marginTop: 12, opacity: 0.8 }}>
              Status: {result.sent ? 'Sent ?' : 'Not sent'}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
