import {Registry} from '../interfaces/registry.interface';

export const joinFiles = (registries: Registry[], filesFolderId: string) => {
  const filesFolder = DriveApp.getFolderById(filesFolderId);
  const files = filesFolder.getFiles();

  while (files.hasNext()) {
    const file = files.next();
    const filename = file.getName();
    const fileId = filename.split(' - ')[0]; // Credential name must be 'C-000 - REGISTRY_NAME'

    const registry = registries.find(({id}) => id === fileId); // IDs will be uniques

    if (registry) registry.file = file;
  }

  return registries;
};
