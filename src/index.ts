import '@babel/polyfill';
import './prototypes';

import * as path from 'path';
import yeoman from 'yeoman-environment';

import { GeneratorOptions } from './types';

const { version: pkgVersion } = require('../package.json');

const defaultConfig = {
  srcDir: 'src',
};

export default function run(args, flags) {
  if (flags.version || flags.v) {
    console.log(pkgVersion);
    return;
  }

  const [command, path] = args;
  const env = yeoman.createEnv();

  const options = <GeneratorOptions> {
    // ...userConfig,
    ...flags,
  };

  switch (command) {
    case 'reducer':
      env.register(require.resolve('./generators/reducer'), 'zwen:reducer');
      env.run('zwen:reducer', options);
      return;

    default:
      console.log('Sorry, I don\'t understand.');
  }
};

/*
static usage = '[SCAFFOLD_TYPE] [PATH_WITH_NAME] [OPTIONS]';
  static examples = [
    '$ zwen reducer filter/date/selectedWeek',
    '$ zwen component ui/closeButton -c',
  ];
  static args = [
    {
      name: 'scaffold_type',
      options: [
        'action',
        'component',
        'reducer',
      ],
      required: true,
      description: 'What do you want to generate?',
    },
    {
      name: 'path_with_name',
      required: true,
      description: 'Where should the new scaffold be placed?'
    },
  ];

  static flags = {
    classComp: flags.boolean({
      char: 'c',
      description: 'Will create a class component where you can use React\'s lifecycle methods.',
    }),
  };
*/
