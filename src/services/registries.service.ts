import {CONFIG} from '../config/config.config';
import {Registry} from '../interfaces/registry.interface';
import {joinCredentials} from './credential.service';

const getRegistriesSheet = () => {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.REGISTRIES.ID);
  return spreadsheet.getSheetByName(CONFIG.REGISTRIES.CONSOLIDATED);
};

export const getRegistries = (): Registry[] => {
  const sheet = getRegistriesSheet();

  const registries = sheet
    .getDataRange()
    .getValues()
    .slice(1)
    .map(([id, email, name, pdfId, notified]) => ({
      id,
      email,
      name,
      pdfId,
      notified,
    }))
    .filter(({id}) => id);

  return joinCredentials(registries);
};

export const updateRegistries = (registries: Registry[]) => {
  const NOTIFIED_COLUMN = 4; // Notified position is 4 (5 - 1) in consolidated sheet

  const sheet = getRegistriesSheet();
  const storedRegistries = sheet
    .getDataRange()
    .getValues()
    .filter(([id]) => id);

  registries.forEach(({id}) => {
    const rowNumber = storedRegistries.findIndex(
      registry => registry[0] === id
    );
    if (rowNumber === -1) return;

    storedRegistries[rowNumber][NOTIFIED_COLUMN] = true;
  });

  const notifiedColumnUpdates = storedRegistries.map(registry => [
    registry[NOTIFIED_COLUMN],
  ]);

  sheet
    .getRange(1, NOTIFIED_COLUMN + 1, notifiedColumnUpdates.length)
    .setValues(notifiedColumnUpdates);
};
