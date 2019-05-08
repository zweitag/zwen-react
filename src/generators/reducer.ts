import Generator from 'yeoman-generator';

import { FileToWrite, GeneratorOptions, Zwenerator } from '../types';
import { addToFile } from '../utils';
import * as r from './constants/regex';
import * as t from './constants/templateStrings';

const PATH_PREFIX = 'reducers';

export default class ReducerGenerator extends Generator implements Zwenerator {
  filesToWrite: FileToWrite[] = [];
  templateConfig: object = {};
  indent: string;
  destDir: string[];
  destPath: string;
  topLevelPath: string;
  absolutePath: string;
  fileName: string;

  constructor(args: string[], options: GeneratorOptions) {
    super(args, options);

    this.indent = options.indent;
    this.destDir = options.destDir;
    this.destPath = this.destDir.join('/');
    this.topLevelPath = `${options.srcDir}/${PATH_PREFIX}`;
    this.absolutePath = `${this.topLevelPath}/${this.destPath}`;
    this.fileName = options.fileName;
  }

  initializing() {
    if (this.destDir.length === 0) {
      this.log('We do not support top-level reducers. Please specify at least one subdirectory.');
      process.exit(0);
    }
  }

  configuring() {
    this.templateConfig = {
      REDUCER_NAME: this.fileName,
      REDUCER_PATH: this.destDir.join('/'),
      SELECTOR_NAME: ['get', ...this.destDir].join('-').toCamelCase(),
      STATE_PARTS: this.destDir,
      STATE_PATH: this.destDir.join('.'),
      indent: (amount = 1) => this.indent.repeat(amount),
    };
  }

  addExports() {
    const destDirWithFileName = this.destDir.concat(this.fileName);
    let currentPath = `${this.topLevelPath}`;

    destDirWithFileName.forEach((subPath: string) => {
      // read
      const importWithNewLine = t.importNamedFrom('combineReducers', 'redux') + '\n';
      const file = this.fs.read(`${currentPath}/index.js`, { defaults: importWithNewLine });
      // update imports
      let updatedFile = addToFile(file, t.importDefaultFrom(subPath, `./${subPath}`), r.selectDefaultImports);

      // insert default export
      if (!r.selectCombineReducersMethod.test(file)) {
        const combineOptions = {
          prefixForAll: '\n',
        };
        updatedFile = addToFile(updatedFile, t.exportDefaultCombineReducers(), undefined, combineOptions);
      }

      // update combined reducers
      const updateOptions = {
        appendixIfNew: '});\n\n',
        prefixForAll: this.indent,
        separator: '',
        suffixForAll: '\n',
      };
      updatedFile = addToFile(updatedFile, `${subPath},`, r.selectCombinedReducers, updateOptions);

      // update selector exports
      updatedFile = addToFile(updatedFile, t.exportAllFrom(subPath), r.selectExportsAll);

      this.filesToWrite.push({ name: `${currentPath}/index.js`, content: updatedFile });

      currentPath += `/${subPath}`;
    });
  }

  addReducer() {
    this.fs.copyTpl(
      this.templatePath(`${PATH_PREFIX}/file.ejs`),
      this.destinationPath(`${this.absolutePath}/${this.fileName}.js`),
      this.templateConfig,
    );
  }

  addReducerTest() {
    this.fs.copyTpl(
      this.templatePath(`${PATH_PREFIX}/test.ejs`),
      this.destinationPath(`${this.absolutePath}/${this.fileName}.test.js`),
      this.templateConfig,
    );
  }

  writing() {
    this.filesToWrite.forEach(({ name, content }) => this.fs.write(name, `${content.trim()}\n`));
  }
}
