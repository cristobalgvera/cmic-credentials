import {sendEmails} from './services/email.service';
import {getRegistries} from './services/registries.service';

function createCredentials() {
  const registries = getRegistries();
  sendEmails(registries);
}
