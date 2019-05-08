import fs from 'fs';
import path from 'path';

const defaultConfig = {
  indent: '  ',
  srcDir: 'src',
};

let config = {
  ...defaultConfig,
};

try {
  const configFile = fs.readFileSync(path.join(process.cwd(), '.zwen'), 'utf-8');
  const userConfig = JSON.parse(configFile);

  config = {
    ...config,
    ...userConfig,
  };

  // tslint:disable-next-line no-empty
} catch (error) {}

export default config;
