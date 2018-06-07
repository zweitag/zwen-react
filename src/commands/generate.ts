import { Command } from '@oclif/command';
import * as path from 'path';
import { createEnv } from 'yeoman-environment';

export default class Generate extends Command {
  static description = 'generate scaffolds like: actions, components, constants, helpers, middlewares, reducers';
  static args = [
    { name: 'scaffoldType', options: ['reducer', 'action'], required: true },
    { name: 'relativePath', required: true },
  ];
  static aliases = ['g'];

  async run() {
    const { args } = this.parse(Generate);
    const env = createEnv();
    let pathToGenerator = '../generators/';
    let namespace = 'zwen:';
    let options = {};

    switch (args.scaffoldType) {
      case 'reducer':
        pathToGenerator += 'reducer';
        namespace += 'reducer';
        options = {
          path: path.parse(args.relativePath).dir,
          filename: path.parse(args.relativePath).name,
        };
        break;
      default:
        this.log('scaffold not supported: ' + args);
    }

    env.register(require.resolve(pathToGenerator), namespace);
    env.run(namespace, options);
  }
}
