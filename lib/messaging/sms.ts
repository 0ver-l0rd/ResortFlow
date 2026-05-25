import { twilioClient, TWILIO_CONFIG } from '../twilio';

export async function sendSMS(to: string, message: string) {
  if (!twilioClient) {
    console.warn(`Twilio not configured. Would have sent SMS to ${to}: ${message}`);
    return { sid: 'mock_sms_sid_' + Math.random() };
  }
  
  if (!TWILIO_CONFIG.fromPhone) {
    throw new Error('TWILIO_PHONE_NUMBER not configured');
  }

  return twilioClient.messages.create({
    body: message,
    from: TWILIO_CONFIG.fromPhone,
    to: to,
  });
}

export async function sendBulkSMS(contacts: { phone: string }[], message: string) {
  const results = await Promise.allSettled(
    contacts.map(contact => sendSMS(contact.phone, message))
  );
  return results;
}
