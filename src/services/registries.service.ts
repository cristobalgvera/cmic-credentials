import {Registry} from '../interfaces/registry.interface';
import {joinCredentials} from './slides.service';

export const getRegistries = (): Registry[] => {
  const spreadsheet = SpreadsheetApp.openById(
    '1L5-PgdXgIyLwczvs93aFSvYSfEc1GA-WxG19yCkGGRY'
  );
  const sheet = spreadsheet.getSheetByName('Consolidated');

  const registries = sheet
    .getDataRange()
    .getValues()
    .map(([id, email, name, pdfId]) => ({
      id,
      email,
      name,
      pdfId,
    }));

  return joinCredentials(registries);
};
