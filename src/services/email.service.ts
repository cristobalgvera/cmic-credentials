import {Registry} from '../interfaces/registry.interface';
import {getRegistries, updateRegistries} from './registries.service';

export function sendEmailsOn(
  emailSendFunction: (registries: Registry[]) => Registry[],
  getRegistriesFunction?: () => Registry[]
) {
  const registries = getRegistriesFunction
    ? getRegistriesFunction()
    : getRegistries();

  const mailedRegistries = emailSendFunction(registries);

  updateRegistries(mailedRegistries);
}

export const sendFile = (registries: Registry[]) => {
  const filteredRegistries = registries.filter(
    ({email, file, notified}) => !!email && !!file && !notified
  );

  const confirmationHtml = HtmlService.createTemplateFromFile(
    'app/assets/certificate.html'
  );

  const mailedRegistries = filteredRegistries.map(registry => {
    const {email, name, file, id, pdfId} = registry;
    const firstName = name.split(' ')[0].trim();
    confirmationHtml.firstName = firstName;
    confirmationHtml.fileId = pdfId;
    const htmlBody = confirmationHtml.evaluate().getContent();

    console.log(`Sending email to ${email} - ID: ${id}, Name: ${name}`);

    try {
      MailApp.sendEmail({
        // to: email,
        to: 'd.corcuera01@ufromail.cl',
        subject: 'Certificado de participación C-MIC 💙',
        name: 'NUMIC',
        // attachments: [file.getAs(MimeType.PDF)],
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
    'app/assets/last-day.html'
  );
  const mailedRegistries = filteredRegistries.map(registry => {
    const {email, name, id} = registry;
    // const firstName = name.split(' ')[0].trim();
    // confirmationHtml.firstName = firstName;
    const htmlBody = confirmationHtml.evaluate().getContent();

    console.log(`Sending email to ${email} - ID: ${id}, Name: ${name}`);

    try {
      MailApp.sendEmail({
        // to: email,
        to: 'd.corcuera01@ufromail.cl',
        subject: 'Último día C-MIC 🔥',
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
