import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

export const sendInquiryEmail = async (data, attachment = null) => {
  const transporter = createTransporter();

  const html = `
    <h2>New Inquiry — OM Packaging Website</h2>
    <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${data.name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Company</td><td style="padding:8px;border:1px solid #ddd">${data.company}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${data.email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${data.phone}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Product / Requirement</td><td style="padding:8px;border:1px solid #ddd">${data.product}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Quantity</td><td style="padding:8px;border:1px solid #ddd">${data.quantity || '—'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd">${data.message || '—'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Preferred Contact</td><td style="padding:8px;border:1px solid #ddd">${data.contactPreference || '—'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Source URL</td><td style="padding:8px;border:1px solid #ddd">${data.sourceUrl || '—'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Submitted At</td><td style="padding:8px;border:1px solid #ddd">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td></tr>
    </table>
  `;

  const mailOptions = {
    from: process.env.AUTOREPLY_FROM,
    to: process.env.INQUIRY_EMAIL,
    cc: process.env.INQUIRY_CC,
    subject: `New Inquiry from ${data.company} — OM Packaging Website`,
    html,
    ...(attachment && {
      attachments: [
        {
          filename: attachment.originalname,
          content: attachment.buffer,
          contentType: attachment.mimetype,
        },
      ],
    }),
  };

  await transporter.sendMail(mailOptions);
};

export const sendAutoReply = async (email, name) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.AUTOREPLY_FROM,
    to: email,
    subject: 'Thank you for your inquiry — OM Packaging',
    html: `
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to <strong>OM Packaging</strong>.</p>
      <p>We have received your inquiry and our team will get back to you within <strong>24 hours</strong>.</p>
      <p>For urgent requirements, you can also reach us directly:</p>
      <ul>
        <li>Phone: <a href="tel:+91XXXXXXXXXX">+91 XXXXXXXXXX</a></li>
        <li>WhatsApp: <a href="https://wa.me/91XXXXXXXXXX">Chat with us</a></li>
        <li>Email: <a href="mailto:info@ompack.in">info@ompack.in</a></li>
      </ul>
      <p>Best regards,<br/><strong>OM Packaging Team</strong><br/>Bengaluru, Karnataka, India</p>
    `,
  });
};
