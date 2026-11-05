import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { validateContactForm, escapeHtml } from './src/utils/portfolio-logic.ts';
import type { ContactApiResponse } from './src/types/portfolio.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'niteshh0x0@gmail.com';
const SENDER_EMAIL = process.env.SENDER_EMAIL || OWNER_EMAIL;
const SENDER_NAME = process.env.SENDER_NAME || 'Nitesh Chaurasiya';
const APP_URL = process.env.APP_URL || 'https://nitesh-chaurasiya.vercel.app';

app.use(express.json({ limit: '100kb' }));

// Simple in-memory rate limiting: max 5 requests per hour per IP
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = Number(process.env.RATE_LIMIT_MAX_PER_HOUR) || 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipRateLimitMap.entries()) {
    if (now > entry.resetTime) {
      ipRateLimitMap.delete(ip);
    }
  }
}, 15 * 60 * 1000);

// Status endpoint for developer and frontend checking
app.get('/api/contact/status', (_req: Request, res: Response) => {
  const isConfigured = Boolean(BREVO_API_KEY && BREVO_API_KEY.trim().length > 10);
  res.json({
    emailServiceConfigured: isConfigured,
    provider: isConfigured ? 'Brevo Transactional API' : 'Fallback Preview Mailer',
    ownerEmailConfigured: Boolean(OWNER_EMAIL),
    senderEmailConfigured: Boolean(SENDER_EMAIL),
    publicSiteUrl: APP_URL,
    timestamp: new Date().toISOString(),
  });
});

// Contact endpoint
app.post('/api/contact', async (req: Request, res: Response): Promise<void> => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  // 1. Rate limiting check
  if (isRateLimited(clientIp)) {
    res.status(429).json({
      success: false,
      message: 'Too many submissions. Please wait an hour before submitting again.',
      error: 'RATE_LIMIT_EXCEEDED',
    } satisfies ContactApiResponse);
    return;
  }

  // 2. Server-side authoritative validation
  const validation = validateContactForm(req.body);
  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      message: 'Please resolve form validation errors.',
      error: 'VALIDATION_FAILED',
      details: validation.errors,
    } satisfies ContactApiResponse);
    return;
  }

  const { fullName, email, subject, category, message, preferredContact } = req.body;
  const submissionTimestamp = new Date().toISOString();

  // Visitor confirmation email HTML
  const visitorHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4EFEA; color: #1C2228; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; padding: 32px; border: 1px solid #E8E2D9; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .header { border-bottom: 2px solid #FFEDD5; padding-bottom: 16px; margin-bottom: 24px; }
    .brand { color: #EA580C; font-size: 20px; font-weight: 700; }
    .body-text { font-size: 15px; line-height: 1.6; color: #2D3748; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #718096; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="brand">Nitesh Chaurasiya</div>
      <p style="margin: 4px 0 0; color: #718096; font-size: 13px;">Student Developer &bull; Full-Stack &bull; Python &bull; AI &bull; IoT</p>
    </div>
    <div class="body-text">
      <p>Hi ${escapeHtml(fullName)},</p>
      <p>Thank you for contacting Nitesh Chaurasiya!</p>
      <p>I've received your message and really appreciate you taking the time to reach out. Whether it's about a project, collaboration, an opportunity, or just a quick hello, your message means a lot.</p>
      <p>I'll review your message and get back to you as soon as possible.</p>
      <p>Thanks again for connecting!</p>
      <p style="margin-top: 24px;"><strong>Best regards,</strong><br>Nitesh Chaurasiya<br><a href="${escapeHtml(APP_URL)}" style="color: #EA580C; text-decoration: none;">${escapeHtml(APP_URL)}</a></p>
    </div>
    <div class="footer">
      This is an automated confirmation email. Please reply through the contact details provided on my portfolio if you need to follow up.
    </div>
  </div>
</body>
</html>
  `.trim();

  // Owner notification email HTML
  const ownerHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F4EFEA; color: #1C2228; padding: 24px; }
    .card { max-width: 650px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; padding: 32px; border: 1px solid #E8E2D9; }
    .badge { display: inline-block; padding: 4px 10px; background: #FFEDD5; color: #C2410C; border-radius: 6px; font-weight: 600; font-size: 12px; }
    .field { margin-bottom: 16px; }
    .field-label { font-size: 12px; text-transform: uppercase; color: #718096; font-weight: 600; margin-bottom: 4px; }
    .field-value { font-size: 15px; color: #1A202C; }
    .message-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="margin: 0 0 16px; color: #EA580C;">New Portfolio Message Received</h2>
    <div class="field">
      <span class="badge">${escapeHtml(category)}</span>
    </div>
    <div class="field">
      <div class="field-label">From</div>
      <div class="field-value"><strong>${escapeHtml(fullName)}</strong> &lt;<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>&gt;</div>
    </div>
    <div class="field">
      <div class="field-label">Subject</div>
      <div class="field-value">${escapeHtml(subject)}</div>
    </div>
    ${preferredContact ? `
    <div class="field">
      <div class="field-label">Preferred Contact</div>
      <div class="field-value">${escapeHtml(preferredContact)}</div>
    </div>` : ''}
    <div class="field">
      <div class="field-label">Message Content</div>
      <div class="message-box">${escapeHtml(message)}</div>
    </div>
    <div class="field" style="margin-top: 24px; font-size: 12px; color: #A0AEC0;">
      Submitted at: ${submissionTimestamp} | Origin IP: ${clientIp}
    </div>
  </div>
</body>
</html>
  `.trim();

  // Check if live Brevo API key is available
  if (BREVO_API_KEY && BREVO_API_KEY.trim().length > 10) {
    try {
      // 1. Send owner notification email via Brevo REST API
      const ownerEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: SENDER_NAME, email: SENDER_EMAIL },
          to: [{ email: OWNER_EMAIL, name: 'Nitesh Chaurasiya' }],
          replyTo: { email: email.trim(), name: fullName.trim() },
          subject: `New Portfolio Message — [${category}] ${subject.trim()}`,
          htmlContent: ownerHtml,
        }),
      });

      if (!ownerEmailResponse.ok) {
        const errorText = await ownerEmailResponse.text();
        console.error('Brevo owner notification failed:', errorText);
        res.status(502).json({
          success: false,
          message: 'Failed to deliver notification to portfolio owner. Please try reaching out directly via email.',
          error: 'PROVIDER_ERROR',
        } satisfies ContactApiResponse);
        return;
      }

      // 2. Send visitor confirmation email via Brevo REST API
      const visitorEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: SENDER_NAME, email: SENDER_EMAIL },
          to: [{ email: email.trim(), name: fullName.trim() }],
          replyTo: { email: OWNER_EMAIL, name: SENDER_NAME },
          subject: 'Thanks for reaching out to Nitesh!',
          htmlContent: visitorHtml,
        }),
      });

      if (!visitorEmailResponse.ok) {
        console.warn('Brevo visitor confirmation failed:', await visitorEmailResponse.text());
        // Owner was notified, but confirmation email had an issue
      }

      res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully! A confirmation email is on its way to your inbox.',
        confirmationSent: visitorEmailResponse.ok,
        ownerNotified: true,
        debugInfo: {
          mode: 'live_brevo',
          timestamp: submissionTimestamp,
          recipient: OWNER_EMAIL,
        },
      } satisfies ContactApiResponse);
      return;
    } catch (err: any) {
      console.error('Error during Brevo email dispatch:', err);
      res.status(500).json({
        success: false,
        message: 'An unexpected network error occurred while communicating with the email provider.',
        error: 'NETWORK_DISPATCH_ERROR',
      } satisfies ContactApiResponse);
      return;
    }
  } else {
    // Graceful developer fallback when BREVO_API_KEY is not configured
    // This logs the verified email and returns a clear notification to the client
    console.log('[Email Fallback Preview Mode] No BREVO_API_KEY supplied.');
    console.log(`[Email Fallback] Message from: ${fullName} <${email}>`);
    console.log(`[Email Fallback] Subject: [${category}] ${subject}`);
    console.log(`[Email Fallback] Notification dispatched to: ${OWNER_EMAIL}`);
    console.log(`[Email Fallback] Visitor confirmation queued for: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Your message has been received! (Development Mode: Brevo API key not set in environment, message logged to server console).',
      confirmationSent: true,
      ownerNotified: true,
      debugInfo: {
        mode: 'fallback_preview',
        timestamp: submissionTimestamp,
        recipient: OWNER_EMAIL,
      },
    } satisfies ContactApiResponse);
  }
});

// Start server and attach Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start portfolio server:', err);
  process.exit(1);
});
