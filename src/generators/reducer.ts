import Generator from 'yeoman-generator';

import { GeneratorOptions, Zwenerator } from '../types';
import { addAlphabetically, extractFileParts } from '../utils';
import * as r from './templates/regex';
import * as t from './templates/templateStrings';

const PATH_PREFIX = 'reducers';

export default class ReducerGenerator extends Generator implements Zwenerator {
  topLevelPath!: string;
  destDir!: string[];
  fileName!: string;

  constructor(args: string[], options: GeneratorOptions) {
    super(args, options);

    this.topLevelPath = `${options.srcDir}/${PATH_PREFIX}`;
    this.fileName = options.fileName;
    this.destDir = options.destDir;
  }

  checkdestDir() {
    if (this.destDir.length < 2) {
      this.log('We do not support top-level reducers. Please specify at least one sub folder!');
      process.exit(0);
    }
  }

  updateTopLevel() {
    const indexFile = this.fs.read(`${this.topLevelPath}/index.js`, { defaults: '' });
    const indexFileParts = extractFileParts(indexFile, r.exportDefaultAs);
    const updatedIndexFile = addAlphabetically(indexFileParts, t.exportDefaultAs(this.destDir[0]));
    this.fs.write(`${this.topLevelPath}/index.js`, updatedIndexFile);

    const selectorFile = this.fs.read(`${this.topLevelPath}/selectors.js`, { defaults: '' });
    const selectorFileParts = extractFileParts(selectorFile, r.exportAll);
    const updatedSelectorFile = addAlphabetically(selectorFileParts, t.exportAll(this.destDir[0]));
    this.fs.write(`${this.topLevelPath}/selectors.js`, updatedSelectorFile);
  }

  updateExports() {
    let currentPath = `${this.topLevelPath}/${this.destDir[0]}/`;
    const exportPaths = this.destDir.slice(1);

    exportPaths.forEach((subPath: string) => {
      if (!this.fs.exists(`${currentPath}/index.js`)) {
        this.fs.copyTpl(
          this.templatePath(`${PATH_PREFIX}/index.ejs`),
          this.destinationPath(`${currentPath}/index.js`),
          {
            REDUCER_NAME: subPath,
          },
        );

      } else {
        const file = this.fs.read(`${currentPath}/index.js`);
        if (!file.includes(t.defaultImport(subPath))) {
          const importParts = extractFileParts(file, r.importDefault, r.exportDefaultCombine);
          const fileWithImports = addAlphabetically(importParts, t.defaultImport(subPath), '\n\n');

          const combinedParts = extractFileParts(fileWithImports, r.exportCombine, r.combineEnd);
          const fileWithCombinedReducer = addAlphabetically(combinedParts, t.exportCombine(subPath), '\n');

          const exportParts = extractFileParts(fileWithCombinedReducer, r.exportAll);
          const updatedFile = addAlphabetically(exportParts, t.exportAll(subPath), '\n\n');

          this.fs.write(`${currentPath}/index.js`, updatedFile);
        }
      }
      currentPath += `${subPath}/`;
    });
  }

  copyFileTemplates() {
    const selectorNameArr = ['get', ...this.destDir];

    this.fs.copyTpl(
      this.templatePath(`${PATH_PREFIX}/file.ejs`),
      this.destinationPath(`${this.topLevelPath}/${this.destDir.join('/')}.js`),
      {
        SELECTOR_NAME: selectorNameArr.join('-').toCamelCase(),
        STATE_PATH: this.destDir.join('.'),
      },
    );

    this.fs.copyTpl(
      this.templatePath(`${PATH_PREFIX}/test.ejs`),
      this.destinationPath(`${this.topLevelPath}/${this.destDir.join('/')}.test.js`),
      {
        REDUCER_NAME: this.fileName,
        REDUCER_PATH: this.destDir.join('/'),
        SELECTOR_NAME: selectorNameArr.join('-').toCamelCase(),
        STATE_PARTS: this.destDir,
        STATE_PATH: this.destDir.join('.'),
      },
    );
  }
}
