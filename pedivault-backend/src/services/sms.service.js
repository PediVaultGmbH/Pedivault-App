// src/services/sms.service.js
const hasRealTwilio =
  process.env.TWILIO_ACCOUNT_SID?.startsWith('AC') &&
  process.env.TWILIO_ACCOUNT_SID.length === 34 &&
  process.env.TWILIO_AUTH_TOKEN?.length > 10;

function getTwilio() {
  if (!hasRealTwilio) return null;
  return require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

async function sendSMS(to, body) {
  if (!to) return;
  const twilio = getTwilio();
  if (twilio) {
    await twilio.messages.create({ body, from: process.env.TWILIO_PHONE_NUMBER, to });
  } else {
    console.log(`\n📱 [DEV SMS] To: ${to}\n${body}\n`);
  }
}

async function sendVaccineReminder(phone, childName, vaccineName, dose) {
  await sendSMS(phone,
    `🌸 PediVault Reminder: ${childName}'s ${vaccineName} (${dose}) is due soon. Log it in the app after the appointment.`
  );
}

async function sendAppointmentReminder(phone, childName, type, time, clinic) {
  await sendSMS(phone,
    `📅 PediVault: ${childName}'s ${type} appointment tomorrow at ${time}${clinic ? ` — ${clinic}` : ''}. Don't forget!`
  );
}

async function sendMedicationReminder(phone, childName, medication, dosage, frequency) {
  await sendSMS(phone,
    `💊 PediVault: Time for ${childName}'s ${medication} (${dosage}) — ${frequency}. Mark as taken in the app.`
  );
}

async function sendWeeklySummary(phone, childName, summary) {
  await sendSMS(phone,
    `📊 PediVault Weekly Summary for ${childName}:\n${summary}\n\nHave a healthy week! 🌸`
  );
}

module.exports = { sendSMS, sendVaccineReminder, sendAppointmentReminder, sendMedicationReminder, sendWeeklySummary };
