import {Registry} from '../interfaces/registry.interface';

export const sendEmails = (registries: Registry[]) => {
  const filteredRegistries = registries.filter(
    ({email, credential, notified}) => !!email && !!credential && !notified
  );

  const confirmationHtml = HtmlService.createTemplateFromFile(
    'app/assets/confirmation.html'
  );

  const mailedRegistries = filteredRegistries.slice(0, 2).map(registry => {
    const {email, name, credential, id} = registry;
    const firstName = name.split(' ')[0].trim();
    confirmationHtml.firstName = firstName;
    const htmlBody = confirmationHtml.evaluate().getContent();

    console.log(`Sending email to ${email} - ID: ${id}, Name: ${name}`);

    try {
      MailApp.sendEmail({
        to: email,
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
