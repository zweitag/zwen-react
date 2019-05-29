import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import read from 'fs-readdir-recursive';
import Generator from 'yeoman-generator';
import fuzzy, { FilterResult } from 'fuzzy';
import autocomplete from 'inquirer-autocomplete-prompt';

import logger from '../logger';
import { FileToWrite, GeneratorOptions, Zwenerator } from '../types';

const readFile = promisify(fs.readFile);

const PATH_PREFIX = 'selectors';

export default class SelectorGenerator extends Generator implements Zwenerator {
  filesToWrite: FileToWrite[] = [];
  templateConfig: object = {};
  indent: string;
  srcDir: string;
  destDir: string[];
  destPath: string;
  topLevelPath: string;
  absolutePath: string;
  fileName: string;

  constructor(args: string[], options: GeneratorOptions) {
    super(args, options);

    this.indent = options.indent;
    this.srcDir = options.srcDir;
    this.destDir = options.destDir;
    this.destPath = this.destDir.join('/');
    this.topLevelPath = `${options.srcDir}/${PATH_PREFIX}`;
    this.absolutePath = `${this.topLevelPath}/${this.destPath}`;
    this.fileName = options.fileName;
  }

  initializing() {
    this.env.adapter.promptModule.registerPrompt('autocomplete', autocomplete);

    const reducerFiles = read(
      path.resolve(this.srcDir, 'reducers'),
      (name: string) =>
        !name.startsWith('.') &&
        !name.endsWith('index.js') &&
        !name.endsWith('test.js')
    );

    console.log(reducerFiles);
  }

  async prompting() {
    const selectors = ['', 'One', 'Two', 'OtherSelector', 'MySelector', 'What'];
    const answers: string[] = [];
    logger.log('Which selectors do you want to use?');

    const promptAnswer = async () => {
      const { selector } = await this.prompt({
        type: 'autocomplete',
        name: 'selector',
        message: '›',
        // autocomplete plugin requires this to be a promise
        async source(_: string[], input: string = '') {
          return fuzzy.filter(input, selectors).map((result: FilterResult<string>) => result.original);
        },
      });

      if (selector) {
        answers.push(selector);
        await promptAnswer();
      }
    };

    await promptAnswer();

    console.log(answers);
  }
}
