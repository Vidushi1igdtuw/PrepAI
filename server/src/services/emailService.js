/**
 * Email Service — Nodemailer
 * Supports Gmail SMTP (default) and any SMTP provider.
 *
 * Required .env variables:
 *   EMAIL_HOST     (e.g. smtp.gmail.com)
 *   EMAIL_PORT     (e.g. 587)
 *   EMAIL_USER     (your Gmail address)
 *   EMAIL_PASS     (Gmail App Password — NOT your login password)
 *   EMAIL_FROM     (e.g. "PrepAI <noreply@yourapp.com>")
 */

const nodemailer = require('nodemailer');
const config = require('../config/config');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!config.emailUser || !config.emailPass) {
    console.warn('[Email] No SMTP credentials configured. Email sending will be skipped.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: config.emailHost || 'smtp.gmail.com',
    port: parseInt(config.emailPort || '587', 10),
    secure: parseInt(config.emailPort || '587', 10) === 465,
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
    tls: {
      rejectUnauthorized: false, // allow self-signed certs in dev
    },
  });

  return transporter;
}

/**
 * Send a password reset email with a secure token link.
 */
async function sendPasswordResetEmail({ toEmail, toName, resetToken, resetUrl }) {
  const transport = getTransporter();

  if (!transport) {
    console.warn(`[Email] Skipping password reset email to ${toEmail} — SMTP not configured.`);
    // Return the token so it can be surfaced in development via API response
    return { skipped: true, devToken: resetToken };
  }

  const expiresIn = '15 minutes';
  const link = resetUrl || `${config.clientUrl}/reset-password?token=${resetToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your PrepAI password</title>
</head>
<body style="margin:0;padding:0;background:#0B0B16;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0B16;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111126;border-radius:16px;border:1px solid #26264A;overflow:hidden;max-width:600px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#8B5CF6,#A78BFA);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:900;color:#fff;letter-spacing:-0.5px;">Prep<span style="color:#C4B5FD;">AI</span></h1>
              <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:2px;text-transform:uppercase;">Your Personal AI Learning Assistant</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#F8FAFC;font-size:22px;margin:0 0 16px;">Reset Your Password</h2>
              <p style="color:#A1A1B5;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Hi <strong style="color:#C4B5FD;">${toName || 'Student'}</strong>,<br/><br/>
                We received a request to reset the password for your PrepAI account.
                Click the button below to set a new password. This link expires in <strong style="color:#FBBF24;">${expiresIn}</strong>.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${link}" style="background:linear-gradient(135deg,#8B5CF6,#A78BFA);color:#fff;text-decoration:none;padding:16px 40px;border-radius:12px;font-weight:700;font-size:16px;display:inline-block;letter-spacing:0.3px;">
                  Reset Password →
                </a>
              </div>
              <p style="color:#A1A1B5;font-size:13px;line-height:1.6;margin:0 0 8px;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>
              <p style="color:#6B6B8A;font-size:12px;margin:0;">
                Or copy and paste this URL into your browser:<br/>
                <span style="color:#8B5CF6;word-break:break-all;">${link}</span>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0B0B16;padding:20px 40px;border-top:1px solid #26264A;text-align:center;">
              <p style="color:#6B6B8A;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} PrepAI Academic Suite. All rights reserved.<br/>
                This is an automated message. Please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const info = await transport.sendMail({
    from: config.emailFrom || `"PrepAI" <${config.emailUser}>`,
    to: toEmail,
    subject: '🔐 Reset Your PrepAI Password',
    html,
    text: `Reset your PrepAI password\n\nHi ${toName || 'Student'},\n\nClick the link below to reset your password (expires in ${expiresIn}):\n\n${link}\n\nIf you didn't request this, ignore this email.\n\n— PrepAI Team`,
  });

  console.log(`[Email] Password reset email sent to ${toEmail} (messageId: ${info.messageId})`);
  return { sent: true, messageId: info.messageId };
}

/**
 * Send a welcome email after registration.
 */
async function sendWelcomeEmail({ toEmail, toName }) {
  const transport = getTransporter();
  if (!transport) return { skipped: true };

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0B0B16;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0B16;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111126;border-radius:16px;border:1px solid #26264A;max-width:600px;">
          <tr>
            <td style="background:linear-gradient(135deg,#8B5CF6,#A78BFA);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:900;color:#fff;">Prep<span style="color:#C4B5FD;">AI</span></h1>
              <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:2px;text-transform:uppercase;">Prepare. Practice. Progress.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#F8FAFC;font-size:22px;margin:0 0 16px;">Welcome to PrepAI, ${toName || 'Student'}! 🎉</h2>
              <p style="color:#A1A1B5;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Your account is live. You now have access to:
              </p>
              <ul style="color:#C4B5FD;font-size:14px;line-height:2;padding-left:20px;margin:0 0 24px;">
                <li>🤖 AI Study Assistant (Llama 3.2)</li>
                <li>💻 Mock OA Arena with real code execution</li>
                <li>🎤 AI Mock Interview Simulator</li>
                <li>📚 Curated Study Materials</li>
                <li>🗺️ Personalized Preparation Roadmap</li>
                <li>📊 Progress Analytics Dashboard</li>
              </ul>
              <div style="text-align:center;margin:32px 0;">
                <a href="${config.clientUrl}/dashboard" style="background:linear-gradient(135deg,#8B5CF6,#A78BFA);color:#fff;text-decoration:none;padding:16px 40px;border-radius:12px;font-weight:700;font-size:16px;display:inline-block;">
                  Go to Dashboard →
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#0B0B16;padding:20px 40px;border-top:1px solid #26264A;text-align:center;">
              <p style="color:#6B6B8A;font-size:12px;margin:0;">© ${new Date().getFullYear()} PrepAI Academic Suite. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const info = await transport.sendMail({
    from: config.emailFrom || `"PrepAI" <${config.emailUser}>`,
    to: toEmail,
    subject: '🎉 Welcome to PrepAI — Your AI-Powered Learning Journey Begins',
    html,
  });

  console.log(`[Email] Welcome email sent to ${toEmail}`);
  return { sent: true, messageId: info.messageId };
}

module.exports = { sendPasswordResetEmail, sendWelcomeEmail };
