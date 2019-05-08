import fs from 'fs';
import path from 'path';

import logger from '../logger';

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

  if (userConfig.indent != null && userConfig.indent.trim() !== '') {
    logger.invalidConfig('indent', 'Your indentation must be any kind of whitespace.');
    userConfig.indent = defaultConfig.indent;
  }

  config = {
    ...config,
    ...userConfig,
  };

  // tslint:disable-next-line no-empty
} catch (error) {}

export default config;
