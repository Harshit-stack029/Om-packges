import twilio from 'twilio';

export const sendWhatsAppAlert = async (data) => {
  if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.WHATSAPP_NUMBER
  ) {
    console.warn('WhatsApp alert skipped — Twilio env vars not configured.');
    return;
  }

  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const message = `🔔 *New Inquiry — OM Packaging*\n\n*Name:* ${data.name}\n*Company:* ${data.company}\n*Phone:* ${data.phone}\n*Product:* ${data.product}\n*Quantity:* ${data.quantity || '—'}`;

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.WHATSAPP_NUMBER,
      body: message,
    });
  } catch (err) {
    // Non-blocking — log but don't rethrow
    console.error('WhatsApp alert failed:', err.message);
  }
};
