import { randomBytes, createCipheriv, createDecipheriv, publicEncrypt, privateDecrypt, createPublicKey, generateKeyPairSync, constants } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, relative, isAbsolute, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PREVIEW, sha256, assert } from './policy.mjs';

export function inventoryDigest(files) {
  return sha256(JSON.stringify(files.map(({path,sha256,bytes}) => ({path,sha256,bytes})).sort((a,b) => a.path.localeCompare(b.path, 'en'))));
}
export function assertBackupScope(proof, approved) {
  assert(approved.target === PREVIEW && approved.bindingSha256 === proof.bindingSha256 &&
    approved.files.length === 63 && proof.fileFingerprints.length === 63 &&
    inventoryDigest(proof.fileFingerprints) === inventoryDigest(approved.files),
  'Backup transfer is restricted to the exact 63 approved server originals');
}
function outsideWorkingDirectory(path) {
  const rel = relative(resolve('.'), resolve(path));
  return isAbsolute(path) && (rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel));
}

function archivePath(path) {
  assert(typeof path === 'string' && /^[A-Za-z0-9_.][A-Za-z0-9_./-]*$/.test(path) &&
    !path.split('/').some(part => !part || part === '.' || part === '..'), 'Unsafe backup path');
  return path;
}

// Only ciphertext may leave the runner. The corresponding private key never
// enters GitHub, the repository, workflow inputs, or any credential environment.
export function encryptBackup(proof, readOriginal, recipient, source) {
  const publicKey = createPublicKey(recipient);
  assert(publicKey.asymmetricKeyType === 'rsa' && publicKey.asymmetricKeyDetails.modulusLength >= 3072, 'Backup requires an RSA public key of at least 3072 bits');
  const files = proof.fileFingerprints.map(file => {
    const body = readOriginal(file.path);
    assert(sha256(body) === file.sha256 && body.length === file.bytes, 'Backup original hash mismatch');
    return {path:archivePath(file.path),sha256:file.sha256,bytes:file.bytes,content:body.toString('base64')};
  });
  const metadata = {schemaVersion:1,target:PREVIEW,root:'./',bindingSha256:proof.bindingSha256,
    checkedAt:proof.checkedAt,commit:source.commit,runId:source.runId,inventorySha256:inventoryDigest(files)};
  const key = randomBytes(32); const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(JSON.stringify(metadata)));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify({files,directories:proof.remoteDirectories})),cipher.final()]);
  const wrappedKey = publicEncrypt({key:publicKey,oaepHash:'sha256',padding:constants.RSA_PKCS1_OAEP_PADDING},key);
  key.fill(0);
  return {metadata,algorithm:'RSA-OAEP-SHA256+A256GCM',wrappedKey:wrappedKey.toString('base64'),iv:iv.toString('base64'),tag:cipher.getAuthTag().toString('base64'),ciphertext:ciphertext.toString('base64')};
}

export function decryptBackup(envelope, privateKey) {
  assert(envelope.algorithm === 'RSA-OAEP-SHA256+A256GCM' && envelope.metadata.schemaVersion === 1 &&
    envelope.metadata.target === PREVIEW && envelope.metadata.root === './', 'Unexpected backup target/format');
  const key = privateDecrypt({key:privateKey,oaepHash:'sha256',padding:constants.RSA_PKCS1_OAEP_PADDING},Buffer.from(envelope.wrappedKey,'base64'));
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(envelope.iv,'base64'));
  decipher.setAAD(Buffer.from(JSON.stringify(envelope.metadata)));
  decipher.setAuthTag(Buffer.from(envelope.tag,'base64'));
  const plain = Buffer.concat([decipher.update(Buffer.from(envelope.ciphertext,'base64')),decipher.final()]); key.fill(0);
  const archive = JSON.parse(plain); plain.fill(0);
  assert(Array.isArray(archive.files) && archive.files.length > 0 && Array.isArray(archive.directories), 'Empty backup');
  const paths = [...archive.files.map(f=>archivePath(f.path)),...archive.directories.map(archivePath)];
  assert(new Set(paths).size === paths.length, 'Duplicate backup path');
  for (const f of archive.files) {
    const raw = Buffer.from(f.content,'base64');
    assert(sha256(raw) === f.sha256 && raw.length === f.bytes, 'Decrypted backup hash mismatch');
  }
  assert(inventoryDigest(archive.files) === envelope.metadata.inventorySha256, 'Backup inventory digest mismatch');
  return archive;
}

export function restoreBackup(envelopePath, keyPath, destination, env = process.env) {
  assert(env.GITHUB_ACTIONS !== 'true', 'Raw backups must be restored privately, never on an Actions runner');
  const dest = resolve(destination);
  assert(outsideWorkingDirectory(destination) && !existsSync(dest), 'Backup destination must be new and outside the repository');
  const encoded = readFileSync(envelopePath);
  const envelope = JSON.parse(encoded);
  const archive = decryptBackup(envelope,readFileSync(keyPath));
  mkdirSync(dest, {mode:0o700}); mkdirSync(dest+'/files',{mode:0o700});
  for (const dir of archive.directories) mkdirSync(dest+'/files/'+dir,{recursive:true,mode:0o700});
  for (const file of archive.files) {
    const path = dest+'/files/'+file.path; mkdirSync(dirname(path),{recursive:true,mode:0o700});
    writeFileSync(path,Buffer.from(file.content,'base64'),{flag:'wx',mode:0o600});
    assert(sha256(readFileSync(path)) === file.sha256, 'Private backup disk verification failed');
  }
  const manifest = {...envelope.metadata,encryptedTransportSha256:sha256(encoded),verifiedAt:new Date().toISOString(),
    files:archive.files.map(({path,sha256,bytes})=>({path,sha256,bytes})),directories:archive.directories};
  writeFileSync(dest+'/backup-manifest.json',JSON.stringify(manifest,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log(JSON.stringify({files:manifest.files.length,inventorySha256:manifest.inventorySha256,verifiedAt:manifest.verifiedAt}));
  return manifest;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv[2] === 'generate-key') {
    assert(process.env.GITHUB_ACTIONS !== 'true', 'Generate the private key locally only');
    const path = process.argv[3]; assert(outsideWorkingDirectory(path) && !existsSync(path) && !existsSync(path+'.pub'), 'Use a new private key path outside the repository');
    const pair = generateKeyPairSync('rsa',{modulusLength:3072,publicKeyEncoding:{type:'spki',format:'pem'},privateKeyEncoding:{type:'pkcs8',format:'pem'}});
    writeFileSync(path,pair.privateKey,{flag:'wx',mode:0o600}); writeFileSync(path+'.pub',pair.publicKey,{flag:'wx',mode:0o600});
    console.log('Private key saved locally; only the .pub recipient may be sent to Actions.');
  } else if (process.argv[2] === 'restore') restoreBackup(process.argv[3],process.argv[4],process.argv[5]);
  else throw Error('Use generate-key or restore');
}
