import {CONFIG} from '../config/config.config';
import {Registry} from '../interfaces/registry.interface';
import {joinCredentials} from './slides.service';

export const getRegistries = (): Registry[] => {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.REGISTRIES.ID);
  const sheet = spreadsheet.getSheetByName(CONFIG.REGISTRIES.SHEET_NAME);

  const registries = sheet
    .getDataRange()
    .getValues()
    .map(([id, email, name, pdfId]) => ({
      id,
      email,
      name,
      pdfId,
    }))
    .filter(({id}) => id);

  registries.shift(); // Remove headers

  return joinCredentials(registries);
};
