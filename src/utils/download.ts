import fs from 'fs';
import axios from 'axios';
import path from 'path';

export default async (url: string, filepath: string) => {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  fs.access(path.resolve(__dirname, 'public', 'img'), fs.constants.R_OK | fs.constants.W_OK, error => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.mkdirSync(path.resolve(__dirname, 'public', 'img'));
      } else {
        return;
      }
    }
    fs.writeFileSync(filepath, Buffer.from(res.data), 'binary');
  });
};
