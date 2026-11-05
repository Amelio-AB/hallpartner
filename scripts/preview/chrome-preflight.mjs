import { createChromeSession, openChromeSocket } from './chrome-session.mjs';

const session = await createChromeSession();
let socket;
try {
  socket = await openChromeSocket(await session.ready());
  console.log('Chrome environment ready: ' + session.evidence.cdpVersion.Browser);
} catch (error) {
  session.evidence.status = 'failed'; session.evidence.error = String(error);
  throw error;
} finally {
  socket?.close();
  await session.close('reports/preview/chrome/environment.json');
}
