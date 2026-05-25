import { twilioClient, TWILIO_CONFIG } from '../twilio';

export async function sendMessage(to: string, message: string, mediaUrl?: string) {
  if (!twilioClient) {
    console.warn(`Twilio not configured. Would have sent WhatsApp to ${to}: ${message}`);
    return { sid: 'mock_sid_' + Math.random() };
  }
  
  if (!TWILIO_CONFIG.fromWhatsApp) {
    throw new Error('TWILIO_WHATSAPP_NUMBER not configured');
  }

  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  
  return twilioClient.messages.create({
    body: message,
    from: TWILIO_CONFIG.fromWhatsApp,
    to: formattedTo,
    mediaUrl: mediaUrl ? [mediaUrl] : undefined,
  });
}

export async function sendBulk(contacts: { phone: string }[], message: string) {
  const results = await Promise.allSettled(
    contacts.map(contact => sendMessage(contact.phone, message))
  );
  return results;
}
