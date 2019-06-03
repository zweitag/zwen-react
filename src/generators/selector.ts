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
  displayName: string;
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
        const path = filePath.replace(/\/\w*\.js/, '').replace(/\//g, ' › ');
        this.existingSelectors.push({
          name,
          path,
          source: REDUCER_PATH_PREFIX,
          displayName: `${path} › ${name}`,
        });
      });
    }));
  }

  async prompting() {
    const DONE_CMD = 'done!';
    const doneSelector: existingSelector = {
      name: '', path: '', source: 'reducers',
      displayName: DONE_CMD,
    };
    const answers: string[] = [];
    let remainingExistingSelectors = [...this.existingSelectors, doneSelector];

    logger.selectorPrompt(DONE_CMD);

    const promptAnswer = async () => {
      const { selector } = await this.prompt({
        type: 'autocomplete',
        name: 'selector',
        message: '›',
        // autocomplete plugin requires this to be a promise
        source: async (_: string[], input: string = '') => (
          fuzzy
            .filter(
              input,
              remainingExistingSelectors,
              { extract: (selector: existingSelector) => selector.displayName }
            )
            .map((result: FilterResult<existingSelector>) => result.string)
        ),
      });

      if (selector && selector !== DONE_CMD) {
        answers.push(selector);
        remainingExistingSelectors = remainingExistingSelectors.filter(s => s.displayName !== selector);
        await promptAnswer();
      }
    };

    await promptAnswer();

    console.log(answers);
  }
}
