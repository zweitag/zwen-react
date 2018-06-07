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
    let currentPath = `src/${pathPrefix}/`;
    filePath.forEach(subPath => {
      if (!this.fs.exists(`${currentPath}index.js`)) {
        this.fs.copyTpl(
          this.templatePath(`${pathPrefix}/index.ejs`),
          this.destinationPath(`${currentPath}index.js`),
          {
            REDUCER_NAME: subPath,
          }
        );
      } else {
        const file = this.fs.read(`${currentPath}index.js`);
        const fileArr = file.split('\n').filter(line => line !== '');

        if (!fileArr.includes(`import ${subPath} from './${subPath}';`)) {
          // imports
          const importStart = fileArr.findIndex(line => /^import (?!{)/.test(line));
          const importEnd = fileArr.findIndex(line => /^export/.test(line));
          const importArray = fileArr.slice(importStart, importEnd);

          importArray.push(`import ${subPath} from './${subPath}';`);
          importArray.sort();
          fileArr.splice(importStart, importArray.length - 1, '', ...importArray, '');

          // combines
          const combineStart = fileArr.findIndex(line => /^export default combineReducers/.test(line));
          const combineEnd = fileArr.findIndex(line => /^}\);$/.test(line));
          const combineArray = fileArr.slice(combineStart + 1, combineEnd);

          combineArray.push(`  ${subPath},`);
          combineArray.sort();
          fileArr.splice(combineStart + 1, combineArray.length - 1, ...combineArray);

          // exports
          const exportStart = fileArr.findIndex(line => /^export \* from/.test(line));
          const exportEnd = fileArr.length;
          const exportArray = fileArr.slice(exportStart, exportEnd);

          exportArray.push(`export * from './${subPath}';`);
          exportArray.sort();
          fileArr.splice(exportStart, exportArray.length - 1, '', ...exportArray);

          this.fs.write(`${currentPath}index.js`, fileArr.join('\n'));
        }
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
