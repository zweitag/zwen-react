import ejs from 'ejs';
import Generator from 'yeoman-generator';

import { FileToWrite, GeneratorOptions, Zwenerator } from '../types';
import { addToFile } from '../utils';
import * as r from './constants/regex';
import * as t from './constants/templateStrings';

const PATH_PREFIX = 'middleware';

export default class MiddlewareGenerator extends Generator implements Zwenerator {
  filesToWrite: FileToWrite[] = [];
  templateConfig: object = {};
  indent: string;
  destDir: string[];
  absolutePath: string;
  fileName: string;

  constructor(args: string[], options: GeneratorOptions) {
    super(args, options);

    this.indent = options.indent;
    this.destDir = options.destDir;
    this.absolutePath = `${options.srcDir}/${PATH_PREFIX}`;
    this.fileName = options.fileName;
  }

  initializing() {
    if (this.destDir.length > 0) {
      this.log('We do not support subdirectories for middleware. Please specify only a name.');
      process.exit(0);
    }
  }

  configuring() {
    this.templateConfig = {
      MIDDLEWARE_NAME: this.fileName,
      indent: (amount = 1) => this.indent.repeat(amount),
    };
  }

  addExports() {
    const newExport = t.exportDefaultAs(this.fileName);

    // read
    const indexFile = this.fs.read(`${this.absolutePath}/index.js`, { defaults: '' });
    // update
    const updatedIndexFile = addToFile(indexFile, newExport, r.selectExports);
    // write
    this.filesToWrite.push({ name: `${this.absolutePath}/index.js`, content: updatedIndexFile });
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
