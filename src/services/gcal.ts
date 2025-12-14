import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { readFile, writeFile } from 'fs/promises';
import { createInterface } from 'readline';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'google_credentials.json';

interface Credentials {
  installed: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

async function loadCredentials(): Promise<Credentials> {
  const content = await readFile(CREDENTIALS_PATH, 'utf-8');
  return JSON.parse(content) as Credentials;
}

async function getAccessToken(oAuth2Client: OAuth2Client): Promise<void> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this URL:');
  console.log(authUrl);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', async (code) => {
      rl.close();
      try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        await writeFile(TOKEN_PATH, JSON.stringify(tokens));
        console.log('Token stored to', TOKEN_PATH);
        resolve();
      } catch (err) {
        console.error('Error retrieving access token', err);
        reject(err);
      }
    });
  });
}

export async function authorize(): Promise<OAuth2Client> {
  const credentials = await loadCredentials();
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  try {
    const token = await readFile(TOKEN_PATH, 'utf-8');
    oAuth2Client.setCredentials(JSON.parse(token));
    console.log('Using existing token');
  } catch {
    console.log('No existing token found, requesting new authorization...');
    await getAccessToken(oAuth2Client);
  }

  return oAuth2Client;
}

export async function listCalendars(auth: OAuth2Client): Promise<void> {
  const calendar = google.calendar({ version: 'v3', auth });

  try {
    const response = await calendar.calendarList.list();
    const calendars = response.data.items;

    if (!calendars || calendars.length === 0) {
      console.log('No calendars found.');
      return;
    }

    console.log('\nCalendars:');
    calendars.forEach((cal) => {
      console.log(`- ${cal.summary} (ID: ${cal.id})`);
    });
  } catch (error) {
    console.error('Error fetching calendars:', error);
  }
}

export async function getEvents(
  auth: OAuth2Client,
  calendarId: string,
  startDate: Date,
  endDate: Date
): Promise<void> {
  const calendar = google.calendar({ version: 'v3', auth });

  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;

    if (!events || events.length === 0) {
      console.log('\nNo events found in the specified date range.');
      return;
    }

    console.log(`\nEvents from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}:`);
    events.forEach((event) => {
      const start = event.start?.dateTime || event.start?.date;
      console.log(`- ${start}: ${event.summary}`);
    });
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}
