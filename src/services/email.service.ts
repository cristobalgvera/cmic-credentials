import {Registry} from '../interfaces/registry.interface';

export const sendEmails = (registries: Registry[]) => {
  const toSendEmailRegistries = registries.filter(
    ({email, credential}) => !!email && !!credential
  );

  const confirmationHtml = HtmlService.createTemplateFromFile(
    'app/assets/confirmation.html'
  );

  toSendEmailRegistries.slice(0, 2).forEach(({email, name, credential}) => {
    const firstName = name.split(' ')[0].trim();
    confirmationHtml.firstName = firstName;
    const htmlBody = confirmationHtml.evaluate().getContent();

    MailApp.sendEmail({
      to: 'd.corcuera01@ufromail.cl',
      subject: '✨ Comenzó C-MIC ✨',
      name: 'NUMIC',
      attachments: [credential.getAs(MimeType.PDF)],
      htmlBody,
    });
  });
};
