import {sendEmails} from './services/email.service';
import {getRegistries, updateRegistries} from './services/registries.service';

function createCredentials() {
  const registries = getRegistries();
  const mailedRegistries = sendEmails(registries);

  updateRegistries(mailedRegistries);
}
