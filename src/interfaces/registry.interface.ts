type File = GoogleAppsScript.Drive.File;

export interface Registry {
  id: string;
  email: string;
  name: string;
  pdfId: string;
  credential?: File;
  notified?: boolean;
}
