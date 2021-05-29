import {Registry} from '../interfaces/registry.interface';

export const sendEmails = (registries: Registry[]) => {
  const toSendEmailRegistries = registries.filter(
    ({email, credential}) => !!email && !!credential
  );

  toSendEmailRegistries.slice(0, 2).forEach(({email, name, credential}) => {
    MailApp.sendEmail({
      to: 'd.corcuera01@ufromail.cl',
      cc: 'cristobalgajardo.v@gmail.com',
      subject: 'TEST EMAIL',
      body: 'TEST BODY',
      name: 'TEST NAME',
      attachments: [credential.getAs(MimeType.PDF)],
    });
  });
};
