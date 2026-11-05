/** Child-process fixture: no real browser, website or external network. */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'node:http';
const mode = process.argv[2];
if (mode === 'exit') { console.error('Synthetic Chrome startup failure'); process.exit(23); }
if (mode === 'hang') setInterval(() => {}, 1000);
if (mode === 'ready') {
  const profile = process.argv.find(arg => arg.startsWith('--user-data-dir=')).split('=').slice(1).join('=');
  const server = createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const endpoint = 'ws://127.0.0.1:' + server.address().port;
    res.end(JSON.stringify(req.url === '/json/version'
      ? { Browser: 'Fixture', webSocketDebuggerUrl: endpoint + '/devtools/browser/fixture' }
      : [{ type: 'page', url: 'about:blank', webSocketDebuggerUrl: endpoint + '/devtools/page/fixture' }]));
  });
  server.listen(0, '127.0.0.1', () => writeFileSync(join(profile, 'DevToolsActivePort'), server.address().port + '\n/devtools/browser/fixture\n'));
}
