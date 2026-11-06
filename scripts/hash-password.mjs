import { randomBytes, scryptSync } from 'node:crypto';

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error('Usage: npm run hash-password -- "your-password-min-10-chars"');
  process.exit(1);
}
const salt = randomBytes(16);
const hash = scryptSync(pw, salt, 64);
// Wrap in single quotes when pasting into shells; in .env / Vercel paste as-is.
console.log(`ADMIN_PASSWORD_HASH=scrypt$${salt.toString('hex')}$${hash.toString('hex')}`);
