import * as Generator from 'yeoman-generator'
const camelCase = require('camelcase');

import { GeneratorOptions } from '../types';
import { pushSort } from '../utils';
import * as t from './templates/reducers/templateStrings';

class ReducerGenerator extends Generator {
  options!: GeneratorOptions;

  constructor(args: Array<string>, options : GeneratorOptions) {
    super(args, options);
  }

  writing() {
    const pathPrefix = 'reducers';
    const { path, fileName } = this.options;
    const filePath = path.split('/').filter(p => p !== '');
    filePath.push(fileName);

    if (filePath.length < 2) {
      this.log('We do not support top-level reducers. Please specify at least one sub folder!');
      return;
    }

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

    filePath.forEach((subPath : string) => {
      if (!this.fs.exists(`${currentPath}index.js`)) {
        const templates = topLevel
          ? [
            { in: 'top.ejs', out: 'index.js' },
            { in: 'selectors.ejs', out: 'selectors.js' },
          ] : [
            { in: 'index.ejs', out: 'index.js' }
          ];

        templates.forEach((template : { in: string, out: string }) => {
          this.fs.copyTpl(
            this.templatePath(`${pathPrefix}/${template.in}`),
            this.destinationPath(`${currentPath}${template.out}`),
            {
              REDUCER_NAME: subPath,
            }
          );
        });

      } else {
        const file = this.fs.read(`${currentPath}index.js`);
        const fileArr = file.split('\n').filter(line => line !== '');

        if (topLevel) {
          if (!fileArr.includes(t.topLevelExport(subPath))) {
            pushSort(fileArr, t.topLevelExport(subPath), '\n');
          }

          // selector top level file
          const selectorFile = this.fs.read(`${currentPath}selectors.js`);
          const selectorArr = selectorFile.split('\n').filter(line => line !== '');

          if (!selectorArr.includes(t.exportAll(subPath))) {
            pushSort(selectorArr, t.exportAll(subPath), '\n');

            this.fs.write(`${currentPath}selectors.js`, selectorArr.join('\n'));
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
