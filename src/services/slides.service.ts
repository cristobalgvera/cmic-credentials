import {Registry} from '../interfaces/registry.interface';

export const joinCredentials = (registries: Registry[]) => {
  const credentialsFolder = DriveApp.getFolderById(
    '1mpisevc_kZbqFBCAPnyEHI-5_mPcOMvi'
  );
  const credentials = credentialsFolder.getFiles();

  while (credentials.hasNext()) {
    const credential = credentials.next();
    const filename = credential.getName();
    const credentialId = filename.split(' | ')[0];

    const registry = registries.find(({id}) => id === credentialId); // IDs will be uniques

    if (registry) registry.credential = credential;
  }

  return registries;
};
