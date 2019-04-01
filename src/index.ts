import '@babel/polyfill';
import './prototypes';

import path from 'path';
import chalk from 'chalk';
import yeoman from 'yeoman-environment';

import { registeredGenerators } from './generators';
import logger from './logger';
import { GeneratorOptions, Flags } from './types';

const { bold, underline } = chalk;

const defaultConfig = {
  srcDir: 'src',
};
// TODO: read user config from .zwen file
const config = {
  ...defaultConfig,
};

module.exports = (args: Array<string>, flags: Flags) => {
  const [command, destPath] = args;

  if (flags.version != null || flags.v) {
    logger.version();
    return;
  }
  if (flags.help != null || flags.h || !command) {
    logger.help();
    return;
  }

  const env = yeoman.createEnv();

  if (registeredGenerators.includes(command)) {
    if (!destPath) {
      logger.missingArgument('PATH_WITH_NAME');
      return;
    }

    const {name: fileName, dir } = path.parse(destPath);

    // TODO: remove fileName from destDir
    const options: GeneratorOptions = {
      ...config,
      fileName,
      destDir: dir.split('/').filterEmptyStrings().concat(fileName),
      classComp: flags.classComp != null || flags.c,
    }

    env.register(require.resolve(`./generators/${command}`), `zwen:${command}`);
    env.run(`zwen:${command}`, options);

  } else {
    logger.unknownCommand(command);
  }
}
