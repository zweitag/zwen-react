import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import read from 'fs-readdir-recursive';
import Generator from 'yeoman-generator';
import fuzzy, { FilterResult } from 'fuzzy';
import autocomplete from 'inquirer-autocomplete-prompt';

import * as r from '../constants/regex';
import logger from '../logger';
import { FileToWrite, GeneratorOptions, Zwenerator } from '../types';

const readFile = promisify(fs.readFile);

const PATH_PREFIX = 'selectors';
const REDUCER_PATH_PREFIX = 'reducers';

interface existingSelector {
  source: 'reducers' | 'selectors';
  path: string;
  name: string;
}

interface SelectorZwenerator extends Zwenerator {
  srcDir: string;
  topLevelReducerPath: string;
  existingSelectors: existingSelector[];
}

export default class SelectorGenerator extends Generator implements SelectorZwenerator {
  filesToWrite: FileToWrite[] = [];
  templateConfig: object = {};
  indent: string;
  srcDir: string;
  destDir: string[];
  destPath: string;
  topLevelPath: string;
  topLevelReducerPath: string;
  absolutePath: string;
  fileName: string;
  existingSelectors: existingSelector[] = [];

  constructor(args: string[], options: GeneratorOptions) {
    super(args, options);

    this.indent = options.indent;
    this.srcDir = options.srcDir;
    this.destDir = options.destDir;
    this.destPath = this.destDir.join('/');
    this.topLevelPath = `${options.srcDir}/${PATH_PREFIX}`;
    this.topLevelReducerPath = `${options.srcDir}/${REDUCER_PATH_PREFIX}`;
    this.absolutePath = `${this.topLevelPath}/${this.destPath}`;
    this.fileName = options.fileName;
  }

  async initializing() {
    this.env.adapter.promptModule.registerPrompt('autocomplete', autocomplete);

    const reducerFiles: string[] = read(
      this.topLevelReducerPath,
      (name: string) =>
        !name.startsWith('.') &&
        !name.endsWith('index.js') &&
        !name.endsWith('test.js')
    );

    await Promise.all(reducerFiles.map(async filePath => {
      const file = await readFile(path.resolve(this.topLevelReducerPath, filePath), 'utf8');
      const fileSelectors = file.match(r.selectExportConstNames) || [];

      fileSelectors.forEach(name => {
        this.existingSelectors.push({
          name,
          path: filePath.replace(/\/\w*\.js/, ''),
          source: REDUCER_PATH_PREFIX,
        });
      });
    }));
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
        source: async (_: string[], input: string = '') => {
          return fuzzy
            .filter(
              input,
              this.existingSelectors,
              { extract: (selector: existingSelector) => `${selector.path} › ${selector.name}` }
            )
            .map((result: FilterResult<existingSelector>) => result.string);
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
