import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, company, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' })
  }

  // ── Gmail SMTP credentials from environment variables ──
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailPass) {
    console.error('GMAIL_USER or GMAIL_APP_PASSWORD env vars not set')
    return res.status(500).json({ error: 'Email service not configured yet.' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  })

  const mailOptions = {
    from: `"Cygnus Automation Website" <${gmailUser}>`,
    to: gmailUser,
    replyTo: email,
    subject: `🚀 New Lead: ${name} — Cygnus Automation`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#0891b2,#4f46e5);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:1.6rem;letter-spacing:0.05em;">CYGNUS AUTOMATION</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:0.85rem;">New Contact Form Submission</p>
        </div>
        <div style="padding:32px;background:#fff;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#666;font-size:0.85rem;width:120px;">Name</td>
                <td style="padding:12px 0;border-bottom:1px solid #eee;font-weight:600;color:#111;">${name}</td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#666;font-size:0.85rem;">Email</td>
                <td style="padding:12px 0;border-bottom:1px solid #eee;color:#0891b2;">${email}</td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#666;font-size:0.85rem;">Company</td>
                <td style="padding:12px 0;border-bottom:1px solid #eee;color:#111;">${company || 'Not provided'}</td></tr>
            <tr><td style="padding:12px 16px 12px 0;color:#666;font-size:0.85rem;vertical-align:top;">Message</td>
                <td style="padding:12px 0;color:#111;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</td></tr>
          </table>
        </div>
        <div style="padding:20px 32px;background:#f9f9f9;text-align:center;">
          <a href="mailto:${email}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#0891b2,#4f46e5);color:#fff;text-decoration:none;border-radius:8px;font-size:0.85rem;font-weight:600;">Reply to ${name}</a>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return res.status(200).json({ success: true, message: 'Message sent successfully!' })
  } catch (err: any) {
    console.error('Nodemailer error:', err)
    return res.status(500).json({ error: 'Failed to send email. Please try again.' })
  }
}
