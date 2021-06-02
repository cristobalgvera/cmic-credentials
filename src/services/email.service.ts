import {Registry} from '../interfaces/registry.interface';
import {getRegistries, updateRegistries} from './registries.service';

export function sendEmailsOn(
  emailSendFunction: (registries: Registry[]) => Registry[]
) {
  const registries = getRegistries();
  const mailedRegistries = emailSendFunction(registries);

  updateRegistries(mailedRegistries);
}

export const sendCredential = (registries: Registry[]) => {
  const filteredRegistries = registries.filter(
    ({email, credential, notified}) => !!email && !!credential && !notified
  );

  const confirmationHtml = HtmlService.createTemplateFromFile(
    'app/assets/confirmation.html'
  );

  const mailedRegistries = filteredRegistries.map(registry => {
    const {email, name, credential, id} = registry;
    const firstName = name.split(' ')[0].trim();
    confirmationHtml.firstName = firstName;
    const htmlBody = confirmationHtml.evaluate().getContent();

    console.log(`Sending email to ${email} - ID: ${id}, Name: ${name}`);

    try {
      MailApp.sendEmail({
        // to: email,
        to: 'd.corcuera01@ufromail.cl',
        subject: '✨ Comenzó C-MIC ✨',
        name: 'NUMIC',
        attachments: [credential.getAs(MimeType.PDF)],
        htmlBody,
      });

      registry.notified = true;
    } catch (error) {
      console.error(error);
      registry.notified = false;
    }

    return registry;
  });

  return mailedRegistries;
};

export function sendDailyEmail(registries: Registry[]) {
  const filteredRegistries = registries.filter(
    ({email, notified}) => !!email && !notified
  );

  const confirmationHtml = HtmlService.createTemplateFromFile(
    'app/assets/confirmation.html'
  );
  const mailedRegistries = filteredRegistries.map(registry => {
    const {email, name, id} = registry;
    const firstName = name.split(' ')[0].trim();
    confirmationHtml.firstName = firstName;
    const htmlBody = confirmationHtml.evaluate().getContent();

    console.log(`Sending email to ${email} - ID: ${id}, Name: ${name}`);

    try {
      MailApp.sendEmail({
        // to: email,
        to: 'd.corcuera01@ufromail.cl',
        subject: 'Segundo día C-MIC ⭐',
        name: 'NUMIC',
        htmlBody,
      });

      registry.notified = true;
    } catch (error) {
      console.error(error);
      registry.notified = false;
    }

    return registry;
  });

  return mailedRegistries;
}
