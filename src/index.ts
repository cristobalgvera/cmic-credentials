import {
  sendCredential,
  sendDailyEmail,
  sendEmailsOn,
} from './services/email.service';

function sendCredentials() {
  sendEmailsOn(sendCredential);
}

function sendDailyEmails() {
  sendEmailsOn(sendDailyEmail);
}
