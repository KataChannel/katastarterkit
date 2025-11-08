// Test if Server Actions work
import { getSettings } from '../actions/settings.actions';

async function testSettings() {
  console.log('Testing getSettings...');
  const settings = await getSettings();
  console.log(`Got ${settings.length} settings`);
  console.log('First 5:', settings.slice(0, 5));
}

testSettings().catch(console.error);
