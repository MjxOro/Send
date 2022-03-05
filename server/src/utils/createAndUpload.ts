import { google } from 'googleapis';

export default async function createAndUpload({
  fileName,
  file,
  mimeType
}: any) {
  try {
    const scopes = ['https://www.googleapis.com/auth/drive'];
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_KEY as string,
      scopes: scopes
    });
    const driveService = google.drive({ version: 'v3', auth });
    let fileMetaData = {
      name: fileName,
      mimeType: mimeType,
      parents: [process.env.GOOGLE_DRIVE_FOLDER as string]
    };
    const media = {
      body: file //Takes stream NOT buffer
    };

    const res = await driveService.files.create({
      requestBody: fileMetaData,
      media: media,
      fields: 'id'
    });

    const link = `https://drive.google.com/uc?export=view&id=${
      res.data.id as string
    }`;
    return link;
  } catch (e) {
    console.log(e);
    //handle Error
  }
}
