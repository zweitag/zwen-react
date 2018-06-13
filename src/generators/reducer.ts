import * as Generator from 'yeoman-generator'
const camelCase = require('camelcase');

import { Zwenerator, GeneratorOptions } from '../types';
import { addAlphabetically, pushSort } from '../utils';
import * as t from './templates/templateStrings';
import * as m from './templates/reducers/getMarkers';

const PATH_PREFIX = 'reducers';

class ReducerGenerator extends Generator implements Zwenerator {
  options!: GeneratorOptions;
  topLevelPath!: string;
  filePath!: Array<string>;

  constructor(args: Array<string>, options : GeneratorOptions) {
    super(args, options);
    this.topLevelPath = `${this.options.srcDir}/${PATH_PREFIX}`;
    this.filePath = this.options.path.split('/').filter(p => p !== '');
    this.filePath.push(this.options.fileName);
  }

  checkFilePath() {
    if (this.filePath.length < 2) {
      this.log('We do not support top-level reducers. Please specify at least one sub folder!');
      process.exit(0);
    }
  }

  updateTopLevel() {
    const indexFile = this.fs.read(`${this.topLevelPath}/index.js`, { defaults: '' });
    const updatedIndexFile = addAlphabetically(indexFile, t.exportDefaultAs(this.filePath[0]));
    this.fs.write(`${this.topLevelPath}/index.js`, updatedIndexFile);

    const selectorFile = this.fs.read(`${this.topLevelPath}/selectors.js`, { defaults: '' });
    const updatedSelectorFile = addAlphabetically(selectorFile, t.exportAll(this.filePath[0]));
    this.fs.write(`${this.topLevelPath}/selectors.js`, updatedSelectorFile);
  }

  updateExports() {
    let currentPath = `${this.topLevelPath}/${this.filePath[0]}/`;
    const exportPaths = this.filePath.slice(1);

    exportPaths.forEach((subPath : string) => {
      if (!this.fs.exists(`${currentPath}/index.js`)) {
        this.fs.copyTpl(
          this.templatePath(`${PATH_PREFIX}/index.ejs`),
          this.destinationPath(`${currentPath}/index.js`),
          {
            REDUCER_NAME: subPath,
          }
        );

      } else {
        const file = this.fs.read(`${currentPath}/index.js`);
        const fileArr = file.split('\n').filter(line => line !== '');

        if (!fileArr.includes(t.defaultImport(subPath))) {
          // imports
          const { importStart, importEnd } = m.getImportMarkers(fileArr);
          const importArray = fileArr.slice(importStart, importEnd);

          pushSort(importArray, t.defaultImport(subPath));
          fileArr.splice(importStart, importArray.length - 1, '', ...importArray, '');

          // combines
          const { combineStart, combineEnd } = m.getCombineMarkers(fileArr);
          const combineArray = fileArr.slice(combineStart, combineEnd);

          pushSort(combineArray, t.exportCombine(subPath));
          fileArr.splice(combineStart, combineArray.length - 1, ...combineArray);

          // exports
          const { exportStart, exportEnd } = m.getExportMarkers(fileArr);
          const exportArray = fileArr.slice(exportStart, exportEnd);

          pushSort(exportArray, t.exportAll(subPath));
          fileArr.splice(exportStart, exportArray.length - 1, '', ...exportArray);
        }
        this.fs.write(`${currentPath}/index.js`, fileArr.join('\n'));
      }
      currentPath += `${subPath}/`;
    });
  }

  copyFileTemplates() {
    const selectorNameArr = ['get', ...this.filePath];

    this.fs.copyTpl(
      this.templatePath(`${PATH_PREFIX}/file.ejs`),
      this.destinationPath(`${this.topLevelPath}/${this.filePath.join('/')}.js`),
      {
        STATE_PATH: this.filePath.join('.'),
        SELECTOR_NAME: camelCase(selectorNameArr.join('-')),
      }
    );

    this.fs.copyTpl(
      this.templatePath(`${PATH_PREFIX}/test.ejs`),
      this.destinationPath(`${this.topLevelPath}/${this.filePath.join('/')}.test.js`),
      {
        REDUCER_NAME: this.options.fileName,
        REDUCER_PATH: this.filePath.join('/'),
        STATE_PARTS: this.filePath,
        STATE_PATH: this.filePath.join('.'),
        SELECTOR_NAME: camelCase(selectorNameArr.join('-')),
      }
    );
  }
}

export = ReducerGenerator;
