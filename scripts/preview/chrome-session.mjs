/** Bounded Chrome startup, isolated profile and evidence independent of site assertions. */
import { spawn, spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir, platform, release, freemem } from 'node:os';
import { join, dirname } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

function errorDetails(error) {
  return { message: String(error), code: error?.code, cause: error?.cause ? errorDetails(error.cause) : undefined,
    errors: error?.errors?.map(errorDetails) };
}

export async function createChromeSession({ executable = process.env.HP_CHROME || 'google-chrome', timeoutMs = 45000, args = [], spawnProcess = spawn } = {}) {
  const profile = await mkdtemp(join(tmpdir(), 'hp-chrome-'));
  // Windows Chrome does not reliably support --version; use /json/version after startup.
  const version = platform() === 'win32' ? {} : spawnSync(executable, ['--version'], { encoding: 'utf8', timeout: 5000, windowsHide: true });
  const evidence = {
    phase: 'chrome-startup', status: 'starting', executable,
    executableVersion: version.stdout?.trim() || null,
    versionError: version.error?.message || null,
    node: process.version, platform: platform(), release: release(), freeMemory: freemem(),
    runnerImage: process.env.ImageVersion || null, timeoutMs, profile,
  };
  const flags = ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--disable-background-networking', '--no-first-run', '--no-default-browser-check',
    '--remote-allow-origins=*', '--remote-debugging-address=127.0.0.1',
    '--remote-debugging-port=0', '--user-data-dir=' + profile, ...args, 'about:blank'];
  evidence.flags = flags;
  const browser = spawnProcess(executable, flags, { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  let startupError, stdout = '', stderr = '';
  browser.on('error', error => { startupError = error; });
  browser.stdout.on('data', chunk => { stdout = (stdout + chunk).slice(-65536); });
  browser.stderr.on('data', chunk => { stderr = (stderr + chunk).slice(-65536); });
  const started = Date.now();
  const session = {
    evidence,
    async ready() {
      try {
        while (Date.now() - started < timeoutMs) {
          if (startupError) throw startupError;
          if (browser.exitCode !== null || browser.signalCode !== null) throw Error('Chrome exited before CDP readiness');
          try {
            // Read only the port published by this process's unique profile. No guessed/fixed port.
            const activePort = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).trim().split(/\r?\n/);
            if (!/^\d+$/.test(activePort[0]) || !activePort[1]?.startsWith('/devtools/browser/')) throw Error('Invalid DevToolsActivePort');
            const origin = 'http://127.0.0.1:' + activePort[0];
            const get = async path => {
              const response = await fetch(origin + path, { signal: AbortSignal.timeout(1000) });
              if (!response.ok) throw Error('CDP HTTP ' + response.status);
              return response.json();
            };
            const versionInfo = await get('/json/version');
            if (new URL(versionInfo.webSocketDebuggerUrl).pathname !== activePort[1]) throw Error('CDP browser/profile mismatch');
            const target = (await get('/json/list')).find(page => page.type === 'page' && page.url === 'about:blank' && page.webSocketDebuggerUrl);
            if (!target) throw Error('CDP page target not ready');
            const targetUrl = new URL(target.webSocketDebuggerUrl);
            if (targetUrl.hostname !== '127.0.0.1' || targetUrl.port !== activePort[0]) throw Error('CDP target outside isolated endpoint');
            Object.assign(evidence, { status: 'ready', startupMs: Date.now() - started, port: Number(activePort[0]), cdpVersion: versionInfo });
            return target;
          } catch (error) { evidence.lastProbeError = String(error); evidence.lastProbeDetails = errorDetails(error); }
          await sleep(100);
        }
        throw Error('Chrome startup deadline exceeded without a verified CDP page');
      } catch (error) {
        evidence.status = 'failed'; evidence.error = String(error);
        throw Error('CHROME_STARTUP: ' + error.message, { cause: error });
      }
    },
    async close(evidencePath) {
      Object.assign(evidence, { elapsedMs: Date.now() - started, pid: browser.pid, exitCode: browser.exitCode, signalCode: browser.signalCode, stdout, stderr });
      if (browser.pid && browser.exitCode === null && browser.signalCode === null) {
        browser.kill('SIGTERM');
        await Promise.race([new Promise(done => browser.once('exit', done)), sleep(2000)]);
        if (browser.exitCode === null && browser.signalCode === null) {
          browser.kill('SIGKILL');
          await Promise.race([new Promise(done => browser.once('exit', done)), sleep(2000)]);
        }
      }
      if (!browser.pid || browser.exitCode !== null || browser.signalCode !== null) {
        try { await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); }
        catch (error) { evidence.cleanupWarning = String(error); }
      } else evidence.cleanupWarning = 'Chrome still running; temporary profile retained';
      if (evidencePath) {
        await mkdir(dirname(evidencePath), { recursive: true });
        await writeFile(evidencePath, JSON.stringify(evidence, null, 2));
      }
    },
  };
  return session;
}

export async function openChromeSocket(target) {
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((done, fail) => {
    const timer = setTimeout(() => { socket.close(); fail(Error('CHROME_STARTUP: WebSocket handshake timeout')); }, 8000);
    socket.addEventListener('open', () => { clearTimeout(timer); done(); }, { once: true });
    socket.addEventListener('error', () => { clearTimeout(timer); fail(Error('CHROME_STARTUP: WebSocket handshake failed')); }, { once: true });
  });
  return socket;
}
