import '@babel/polyfill';
import './prototypes';

import yeoman from 'yeoman-environment';
import chalk from 'chalk';

import { registeredGenerators } from './generators';
import logger from './logger';
import { GeneratorOptions, Flags } from './types';

const { bold, underline } = chalk;

const defaultConfig = {
  srcDir: 'src',
};
// TODO: read user config from .zwen file
const config = <GeneratorOptions> {
  ...defaultConfig,
};

module.exports = (args: Array<string>, flags: Flags) => {
  const [command] = args;

  if (flags.version || flags.v) {
    logger.version();
    return;
  }
  if (flags.help || flags.h || !command) {
    logger.help();
    return;
  }

  const env = yeoman.createEnv();

  if (registeredGenerators.includes(command)) {
    env.register(require.resolve(`./generators/${command}`), `zwen:${command}`);
    env.run(`zwen:${command}`, config);
    return;
  }

  logger.log(`Unknown command ${bold.red(command)}.`);
  logger.log(`Available options are ${bold.green(registeredGenerators.toString('|', '(', ')'))}.`);
  logger.log(`Use ${underline('zwen --help')} for more info.`);
}
