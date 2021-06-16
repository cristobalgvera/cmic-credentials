import {sendFile, sendDailyEmail, sendEmailsOn} from './services/email.service';
import {getToSendCertificateRegistries} from './services/registries.service';

function sendCredentials() {
  sendEmailsOn(sendFile);
}

function sendDailyEmails() {
  sendEmailsOn(sendDailyEmail);
}

function sendCertificates() {
  sendEmailsOn(sendFile, getToSendCertificateRegistries);
}
