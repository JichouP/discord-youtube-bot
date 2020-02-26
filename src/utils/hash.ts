import { createHash } from 'crypto';
export default (string: string): string =>
  createHash('sha512')
    .update(string)
    .digest('hex');
