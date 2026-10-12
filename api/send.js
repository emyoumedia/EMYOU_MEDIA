// api/send.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = 'emyoumedia@gmail.com';
const FROM = 'EmYou Media <noreply@emyoumedia.com>'; // domain must be verified in Resend

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (s = '') => String(s).replace(/[\r\n]+/g, ' ').trim().slice(0, 200);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const d = req.body || {};
  if (d.botcheck) return res.status(200).json({ success: true }); // honeypot

  if (!d.name || !d.message || !/^\S+@\S+\.\S+$/.test(d.email || '')) {
    return res.status(400).json({ success: false, message: 'Missing or invalid fields' });
  }

  const subjects = {
    contact: 'New Enquiry — EmYou Media',
    consultation: 'Consultation Request — EmYou Media',
    career: `Career Application — ${clean(d.role) || 'General'}`
  };
  const subject = subjects[d.formType] || subjects.contact;

  const skip = ['botcheck', 'formType'];
  const rows = Object.entries(d)
    .filter(([k, v]) => v && !skip.includes(k))
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;vertical-align:top">${esc(k)}</td><td style="padding:6px 12px;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('');

  const { error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    replyTo: clean(d.email),
    subject,
    html: `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows}</table>`
  });

  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true });
}

const type = d.formType;

if (!/^\S+@\S+\.\S+$/.test(d.email || '')) {
  return res.status(400).json({ success: false, message: 'Invalid email' });
}
if (type !== 'newsletter' && (!d.name || !d.message)) {
  return res.status(400).json({ success: false, message: 'Missing fields' });
}

const subjects = {
  contact: 'New Enquiry — EmYou Media',
  consultation: 'Consultation Request — EmYou Media',
  career: `Career Application — ${clean(d.role) || 'General'}`,
  newsletter: 'New Newsletter Subscriber'
};
const subject = subjects[type] || subjects.contact;