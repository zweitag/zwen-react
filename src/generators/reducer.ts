import * as Generator from 'yeoman-generator'
const camelCase = require('camelcase');

import { GeneratorOptions } from '../types';

class ReducerGenerator extends Generator {
  options!: GeneratorOptions;

  constructor(args: any, options : GeneratorOptions) {
    super(args, options);
  }

  writing() {
    const pathPrefix = 'reducer';
    const { path, fileName } = this.options;
    const filePath = path.split('/');
    filePath.push(fileName);
    const selectorNameArr = ['get', ...filePath];

    this.fs.copyTpl(
      this.templatePath(`${pathPrefix}/file.ejs`),
      this.destinationPath(`src/${pathPrefix}/${filePath.join('/')}.js`),
      {
        STATE_PATH: filePath.join('.'),
        SELECTOR_NAME: camelCase(selectorNameArr.join('-')),
      }
    );
    let currentPath = '/';
    filePath.forEach(subPath => {
      if (!this.fs.exists(`${pathPrefix}${currentPath}index.js`)) {
        this.fs.copyTpl(
          this.templatePath(`${pathPrefix}/index.ejs`),
          this.destinationPath(`src/${pathPrefix}${currentPath}index.js`),
          {
            REDUCER_NAME: subPath,
          }
        );
      }
      currentPath += `${subPath}/`;
    });
  }

  logging() {
    this.log('Destination Root: ' + this.destinationRoot());
    this.log('Template Root: ' + this.sourceRoot());
  }
}

export = ReducerGenerator;
