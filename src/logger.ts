import chalk from 'chalk';

import { registeredGenerators } from './generators';

// tslint:disable-next-line no-var-requires
const { version: pkgVersion } = require('../package.json');
const { log } = console;
const { bold, underline, gray } = chalk;

export default {
  log(text: string) {
    log(text);
  },
  version() {
    log(pkgVersion);
  },
  showHelpCmd() {
    log(`Use ${underline('zwen --help')} for more info.`);
  },
  help() {
    log(bold('USAGE'));
    log('  $ zwen [SCAFFOLD_TYPE] [PATH_WITH_NAME] [OPTIONS]');
    log('');
    log(bold('ARGUMENTS'));
    log(`  SCAFFOLD_TYPE     ${gray('What do you want to generate?')}`);
    log(`                    ${gray.underline(registeredGenerators.toString('|', '(', ')'))}`);
    log(`  PATH_WITH_NAME    ${gray('Where should the new scaffold be placed?')}`);
    log(`                    ${gray('for example ' + underline('data/users'))}`);
    log('');
    log(bold('OPTIONS'));
    log(`  -c, --classComp   ${gray('Will create a class component')}`);
    log(`                    ${gray('Useful if you need React lifecycle methods')}`);
    log(`  -h, --help        ${gray('Show this summary')}`);
    log(`  -v, --version     ${gray('Logs your installed ' + underline('zwen') + ' version')}`);
    log('');
    log(bold('EXAMPLES'));
    log(`  $ zwen reducer filter/date/selectedWeek`);
    log(`  $ zwen component ui/closeButton -c`);
  },
  unknownCommand(command: string) {
    log(`Unknown command: ${bold.red(command)}.`);
    log(`Available options are: ${bold.green(registeredGenerators.toString('|', '(', ')'))}.`);
    this.showHelpCmd();
  },
  missingArgument(arg: string) {
    log(`Missing argument: ${bold.red(arg)}`);
    this.showHelpCmd();
  },
};
