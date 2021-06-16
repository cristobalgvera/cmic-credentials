import {CONFIG} from '../config/config.config';
import {Registry} from '../interfaces/registry.interface';
import {joinFiles} from './file.service';

const getRegistriesSheet = () => {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.REGISTRIES.ID);
  return spreadsheet.getSheetByName(CONFIG.REGISTRIES.CONSOLIDATED);
};

const getToSendCertificateRegistriesSheet = () => {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.CERTIFICATES.ID);
  return spreadsheet.getSheetByName(CONFIG.CERTIFICATES.CERTIFICATES);
};

export const getRegistries = (): Registry[] => {
  const sheet = getRegistriesSheet();

  const registries = extractFormattedRegistries(sheet);

  return joinFiles(registries, CONFIG.FILES_FOLDER.CREDENTIALS);
};

export const getToSendCertificateRegistries = (): Registry[] => {
  const sheet = getToSendCertificateRegistriesSheet();

  const registries = extractFormattedRegistries(sheet);

  return joinFiles(registries, CONFIG.FILES_FOLDER.CERTIFICATES);
};

export const updateRegistries = (registries: Registry[]) => {
  const NOTIFIED_COLUMN = 4; // Notified position is 4 (5 - 1) in consolidated sheet

  const sheet = getToSendCertificateRegistriesSheet();
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

function extractFormattedRegistries(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
  return sheet
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
}
