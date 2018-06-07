import * as Generator from 'yeoman-generator'
const camelCase = require('camelcase');

import { GeneratorOptions } from '../types';


class ReducerGenerator extends Generator {
  options!: GeneratorOptions;

  constructor(args: any, options : GeneratorOptions) {
    super(args, options);
  }

  writing() {
    const { path, fileName } = this.options;
    const filePath = path.split('/');
    filePath.push(fileName);
    const selectorNameArr = ['get', ...filePath];

    this.fs.copyTpl(
      this.templatePath('reducer.ejs'),
      this.destinationPath(`src/reducer/${filePath.join('/')}.js`),
      {
        STATE_PATH: filePath.join('.'),
        SELECTOR_NAME: camelCase(selectorNameArr.join('-')),
      }
    );

    this.fs.copyTpl(
      this.templatePath('reducerIndex.ejs'),
      this.destinationPath(`src/reducer/${path}/index.js`),
      {
        REDUCER_NAME: fileName,
      }
    );
  }

  logging() {
    this.log('Destination Root: ' + this.destinationRoot());
    this.log('Template Root: ' + this.sourceRoot());
  }
}

export = ReducerGenerator;
