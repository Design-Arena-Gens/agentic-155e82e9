export const metadata = {
  title: "Email Automation Taskforce",
  description: "Compose and send high-quality emails using Gemini"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif', background: '#0b1020', color: '#e7e9ee', minHeight: '100vh' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', padding: '40px 24px' }}>
          <header style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 28 }}>Email Automation Taskforce</h1>
            <p style={{ marginTop: 8, opacity: 0.8 }}>Powered by Gemini and SMTP</p>
          </header>
          {children}
          <footer style={{ marginTop: 48, opacity: 0.6, fontSize: 12 }}>
            <div>Set GOOGLE_API_KEY and SMTP_* env vars for sending.</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
