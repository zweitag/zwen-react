import './prototypes';

import { Command, flags } from '@oclif/command';
import * as path from 'path';
import { GeneratorOptions } from './types';
import scaffoldTypes from './scaffoldTypes';

const yeoman = require('yeoman-environment');
const memFs = require('mem-fs');
const memFsEditor = require('mem-fs-editor');

const fs = memFsEditor.create(memFs.create());

class Zwen extends Command {
  static usage = '[SCAFFOLD_TYPE] [PATH_WITH_NAME] [OPTIONS]';
  static examples = [
    '$ zwen reducer filter/date/selectedWeek',
    '$ zwen component ui/closeButton -c',
  ];
  static args = [
    {
      name: 'scaffold_type',
      options: scaffoldTypes,
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

  async run() {
    const defaultConfig = {
      srcDir: 'src',
    };
    const userConfig = fs.readJSON(path.join(process.cwd(), '.zwen'), defaultConfig);

    const { args, flags } = this.parse(Zwen);
    const env = yeoman.createEnv();
    const generatorPathArr = ['.', 'generators'];
    const namespaceArr = ['zwen'];
    const options = <GeneratorOptions> {
      ...userConfig,
      ...flags,
    };

    generatorPathArr.push(args.scaffold_type);
    namespaceArr.push(args.scaffold_type);
    options.path = path.parse(args.path_with_name).dir;
    options.fileName = path.parse(args.path_with_name).name;

    const namespace = namespaceArr.join(':');
    const generatorPath =generatorPathArr.join('/');

    env.register(require.resolve(generatorPath), namespace);
    env.run(namespace, options);
  }
}

export = Zwen;
