import { Command } from '@oclif/command';
import * as path from 'path';
import { GeneratorOptions } from './types';

const yeoman = require('yeoman-environment');

class Zwen extends Command {
  static description = 'generate scaffolds like: actions, components, constants, helpers, middlewares, reducers';
  static args = [
    { name: 'scaffoldType', options: ['reducer', 'action'], required: true },
    { name: 'relativePath', required: true },
  ];

  async run() {
    const { args } = this.parse(Zwen);
    const env = yeoman.createEnv();
    const generatorPathArr = ['.', 'generators'];
    const namespaceArr = ['zwen'];
    const options = <GeneratorOptions> {};

    switch (args.scaffoldType) {
      case 'reducer':
        generatorPathArr.push('reducer');
        namespaceArr.push('reducer');
        options.path = path.parse(args.relativePath).dir;
        options.filename = path.parse(args.relativePath).name;
        break;
      default:
        this.log('scaffold not supported: ' + args);
    }

    const namespace = namespaceArr.join(':');
    const generatorPath =generatorPathArr.join(':');

    env.register(require.resolve(generatorPath), namespace);
    env.run(namespace, options);
  }
}

export = Zwen;
