import { Command } from '@oclif/command';
import * as path from 'path';
import { GeneratorOptions } from './types';
import scaffoldTypes from './scaffoldTypes';

const yeoman = require('yeoman-environment');

class Zwen extends Command {
  static description = 'generate scaffolds like: actions, components, constants, helpers, middlewares, reducers';
  static args = [
    { name: 'scaffoldType', options: scaffoldTypes, required: true },
    { name: 'relativePath', required: true },
  ];

  async run() {
    const { args } = this.parse(Zwen);
    const env = yeoman.createEnv();
    const generatorPathArr = ['.', 'generators'];
    const namespaceArr = ['zwen'];
    const options = <GeneratorOptions> {};

    generatorPathArr.push(args.scaffoldType);
    namespaceArr.push(args.scaffoldType);
    options.path = path.parse(args.relativePath).dir;
    options.fileName = path.parse(args.relativePath).name;

    const namespace = namespaceArr.join(':');
    const generatorPath =generatorPathArr.join('/');

    env.register(require.resolve(generatorPath), namespace);
    env.run(namespace, options);
  }
}

export = Zwen;
