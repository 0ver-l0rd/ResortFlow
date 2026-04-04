import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

if (!accountSid || !authToken) {
  console.warn('Twilio credentials missing. Messaging will not work.');
}

export const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const TWILIO_CONFIG = {
  fromPhone: phoneNumber,
  fromWhatsApp: whatsappNumber,
};
