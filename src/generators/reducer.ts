import * as Generator from 'yeoman-generator'
const camelCase = require('camelcase');

import { GeneratorOptions } from '../types';
import { pushSort } from '../utils';
import * as t from './templates/reducers/templateStrings';

class ReducerGenerator extends Generator {
  options!: GeneratorOptions;

  constructor(args: any, options : GeneratorOptions) {
    super(args, options);
  }

  writing() {
    const pathPrefix = 'reducers';
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

    this.fs.copyTpl(
      this.templatePath(`${pathPrefix}/test.ejs`),
      this.destinationPath(`src/${pathPrefix}/${filePath.join('/')}.test.js`),
      {
        REDUCER_NAME: fileName,
        REDUCER_PATH: filePath.join('/'),
        STATE_PARTS: filePath,
        STATE_PATH: filePath.join('.'),
        SELECTOR_NAME: camelCase(selectorNameArr.join('-')),
      }
    );

    let currentPath = `src/${pathPrefix}/`;
    let topLevel = true;

    filePath.forEach(subPath => {
      if (!this.fs.exists(`${currentPath}index.js`)) {
        const templateName = topLevel ? 'top.ejs' : 'index.ejs';

        this.fs.copyTpl(
          this.templatePath(`${pathPrefix}/${templateName}`),
          this.destinationPath(`${currentPath}index.js`),
          {
            REDUCER_NAME: subPath,
          }
        );

      } else {
        const file = this.fs.read(`${currentPath}index.js`);
        const fileArr = file.split('\n').filter(line => line !== '');

        if (topLevel) {
          if (!fileArr.includes(t.topLevelExport(subPath))) {
            pushSort(fileArr, t.topLevelExport(subPath));
          }

        } else {
          if (!fileArr.includes(t.defaultImport(subPath))) {
            // imports
            const { importStart, importEnd } = t.getImportMarkers(fileArr);
            const importArray = fileArr.slice(importStart, importEnd);

            pushSort(importArray, t.defaultImport(subPath));
            fileArr.splice(importStart, importArray.length - 1, '', ...importArray, '');

            // combines
            const { combineStart, combineEnd } = t.getCombineMarkers(fileArr);
            const combineArray = fileArr.slice(combineStart, combineEnd);

            pushSort(combineArray, t.exportCombine(subPath));
            fileArr.splice(combineStart, combineArray.length - 1, ...combineArray);

            // exports
            const { exportStart, exportEnd } = t.getExportMarkers(fileArr);
            const exportArray = fileArr.slice(exportStart, exportEnd);

            pushSort(exportArray, t.exportAll(subPath));
            fileArr.splice(exportStart, exportArray.length - 1, '', ...exportArray);
          }
        }
        this.fs.write(`${currentPath}index.js`, fileArr.join('\n'));
      }
      topLevel = false;
      currentPath += `${subPath}/`;
    });
  }
}

export = ReducerGenerator;
