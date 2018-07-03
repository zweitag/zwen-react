import * as Generator from 'yeoman-generator'

import { Zwenerator, GeneratorOptions } from '../types';
import { addAlphabetically, extractFileParts } from '../utils';
import * as t from './templates/templateStrings';
import * as r from './templates/regex';

const PATH_PREFIX = 'reducers';

class ReducerGenerator extends Generator implements Zwenerator {
  options!: GeneratorOptions;
  topLevelPath!: string;
  filePath!: Array<string>;

  constructor(args: Array<string>, options : GeneratorOptions) {
    super(args, options);
    this.topLevelPath = `${this.options.srcDir}/${PATH_PREFIX}`;
    this.filePath = this.options.path.split('/').filterEmptyStrings();
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
    const indexFileParts = extractFileParts(indexFile, r.exportDefaultAs);
    const updatedIndexFile = addAlphabetically(indexFileParts, t.exportDefaultAs(this.filePath[0]));
    this.fs.write(`${this.topLevelPath}/index.js`, updatedIndexFile);

    const selectorFile = this.fs.read(`${this.topLevelPath}/selectors.js`, { defaults: '' });
    const selectorFileParts = extractFileParts(selectorFile, r.exportAll);
    const updatedSelectorFile = addAlphabetically(selectorFileParts, t.exportAll(this.filePath[0]));
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
        if (!file.includes(t.defaultImport(subPath))) {
          const importParts = extractFileParts(file, r.importDefault, r.exportDefaultCombine);
          const fileWithImports = addAlphabetically(importParts, t.defaultImport(subPath));

          const combinedParts = extractFileParts(fileWithImports, r.exportCombine, r.combineEnd)
          const fileWithCombinedReducer = addAlphabetically(combinedParts, t.exportCombine(subPath), '\n');

          const exportParts = extractFileParts(fileWithCombinedReducer, r.exportAll);
          const updatedFile = addAlphabetically(exportParts, t.exportAll(subPath));

          this.fs.write(`${currentPath}/index.js`, updatedFile);
        }
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
        SELECTOR_NAME: selectorNameArr.join('-').toCamelCase(),
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
        SELECTOR_NAME: selectorNameArr.join('-').toCamelCase(),
      }
    );
  }
}

export = ReducerGenerator;
