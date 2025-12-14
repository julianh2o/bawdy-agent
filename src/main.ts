import { authorize, listCalendars } from './services/gcal.js';

export async function run(): Promise<void> {
  try {
    const auth = await authorize();
    console.log('Successfully authenticated with Google Calendar API!');

    await listCalendars(auth);
  } catch (error) {
    console.error('Error during authentication:', error);
  }
}

run();
