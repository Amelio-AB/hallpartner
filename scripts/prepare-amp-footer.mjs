/**
 * Opt-in static AMP-003 adapter. Invoked by npm predev/prebuild.
 * Uses the approved @amelio/web-platform public exports; never copies platform
 * source into the customer repository. Default CI/build preserves legacy footer.
 */
import { readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AMP003_APPROVED_VERSION, hallpartnerFooterConfig } from '../src/config/hallpartner-footer.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const htmlPath = join(root, '.generated', 'amp-003-footer.html');
const cssPath = join(root, 'public', 'generated', 'amp-003-footer.css');
const mode = process.env.HALLPARTNER_FOOTER_MODE || 'legacy';

if (mode !== 'legacy' && mode !== 'amp-003') {
  throw new Error('HALLPARTNER_FOOTER_MODE must be legacy or amp-003');
}

if (mode === 'legacy') {
  // Prevent previously generated AMP assets leaking into a fallback build.
  await Promise.all([rm(htmlPath, { force: true }), rm(cssPath, { force: true })]);
  console.log('AMP-003 Footer: legacy fallback retained (private package not required).');
} else {
  if (Number(process.versions.node.split('.')[0]) < 24) {
    throw new Error('AMP-003 requires Node.js 24 or later.');
  }

  // No private Git authentication or package installation is performed here.
  // Installation must use the reviewed, fully pinned source revision.
  let manifest;
  try {
    manifest = JSON.parse(await readFile(
      join(root, 'node_modules', '@amelio', 'web-platform', 'package.json'), 'utf8',
    ));
  } catch (error) {
    throw new Error('AMP-003 is not installed. Use an authenticated, pinned private package before enabling this mode.', { cause: error });
  }
  if (manifest.name !== '@amelio/web-platform' || manifest.version !== AMP003_APPROVED_VERSION) {
    throw new Error('AMP-003 needs approved @amelio/web-platform ' + AMP003_APPROVED_VERSION + '; installed: ' + manifest.name + '@' + manifest.version);
  }

  // The renderer produces validated, escaped HTML using the public contract.
  const { renderFooter } = await import('@amelio/web-platform/footer');
  const html = renderFooter(hallpartnerFooterConfig);
  if (!html.startsWith('<footer class="af af--compact"') ||
      (html.match(/<footer(?:\s|>)/g) || []).length !== 1 ||
      !html.includes('class="af__mobile-groups"')) {
    throw new Error('Unexpected AMP-003 Footer renderer output. Stop before using generated HTML.');
  }
  const css = await readFile(fileURLToPath(
    import.meta.resolve('@amelio/web-platform/footer/style.css')), 'utf8');
  if (!css.includes('.af__mobile-groups') || !css.includes('.af__frame')) {
    throw new Error('AMP-003 public stylesheet contract could not be verified.');
  }

  await Promise.all([mkdir(dirname(htmlPath), { recursive: true }), mkdir(dirname(cssPath), { recursive: true })]);
  await Promise.all([writeFile(htmlPath, html + '\n', 'utf8'), writeFile(cssPath, css, 'utf8')]);
  console.log('AMP-003 Footer: generated approved ' + manifest.version + ' Compact HTML/CSS for site pages (no deployment).');
}
