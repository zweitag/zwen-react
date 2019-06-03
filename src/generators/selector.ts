import ejs from 'ejs';
import fs from 'fs';
import read from 'fs-readdir-recursive';
import fuzzy, { FilterResult } from 'fuzzy';
import autocomplete from 'inquirer-autocomplete-prompt';
import path from 'path';
import { promisify } from 'util';
import Generator from 'yeoman-generator';

import * as r from '../constants/regex';
import * as t from '../constants/templateStrings';
import logger from '../logger';
import { FileToWrite, GeneratorOptions, Zwenerator } from '../types';
import addToFile from '../utils/addToFile';

const readFile = promisify(fs.readFile);

const PATH_PREFIX = 'selectors';
const REDUCER_PATH_PREFIX = 'reducers';
const POSSIBLE_STATE_NAMES = 'abcdefghijklmnopqrstuvwxyz'.split('');

interface ExistingSelector {
  source: 'reducers' | 'selectors';
  path: string;
  name: string;
  displayName: string;
}

interface SelectorZwenerator extends Zwenerator {
  srcDir: string;
  topLevelReducerPath: string;
  existingSelectors: ExistingSelector[];
  chosenSelectors: ExistingSelector[];
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
  existingSelectors: ExistingSelector[] = [];
  chosenSelectors: ExistingSelector[] = [];

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
        !name.endsWith('test.js'),
    );

    await Promise.all(reducerFiles.map(async filePath => {
      const file = await readFile(path.resolve(this.topLevelReducerPath, filePath), 'utf8');
      const fileSelectors = file.match(r.selectExportConstNames) || [];

      fileSelectors.forEach(name => {
        const displayedPath = filePath.replace(/\/\w*\.js/, '').replace(/\//g, ' › ');
        this.existingSelectors.push({
          name,
          path: displayedPath,
          source: REDUCER_PATH_PREFIX,
          displayName: `${displayedPath} › ${name}`,
        });
      });
    }));
  }

  async prompting() {
    const DONE_CMD = 'done!';
    const doneSelector: ExistingSelector = {
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
              { extract: (s: ExistingSelector) => s.displayName },
            )
            .map((result: FilterResult<ExistingSelector>) => result.string)
        ),
      });

      if (selector && selector !== DONE_CMD) {
        answers.push(selector);
        remainingExistingSelectors = remainingExistingSelectors.filter(s => s.displayName !== selector);
        await promptAnswer();
      }
    };

    await promptAnswer();

    this.chosenSelectors = this.existingSelectors.filter(({ displayName }) => answers.includes(displayName));
  }

  configuring() {
    this.templateConfig = {
      SELECTOR_NAME: this.fileName,
      USED_SELECTORS: this.chosenSelectors.map(s => s.name),
      STATE_NAMES: POSSIBLE_STATE_NAMES.slice(0, this.chosenSelectors.length).join(', '),
      indent: (amount = 1) => this.indent.repeat(amount),
    };
  }

  addExports() {
    let currentPath = `${this.topLevelPath}`;

    this.destDir.forEach((subPath: string, index: number) => {
      // read
      const fileDefaults = index === 0 ? t.exportAllFromReducers() : '';
      const file = this.fs.read(`${currentPath}/index.js`, { defaults: fileDefaults });
      // update imports
      const updatedFile = addToFile(file, t.exportAllFrom(subPath), r.selectExportsAll);

      this.filesToWrite.push({ name: `${currentPath}/index.js`, content: updatedFile });

      currentPath += `/${subPath}`;
    });
  }

  addSelector() {
    // 1. select file contents (import createSelector)
    // 2. update imports
    const selectorTemplate = this.fs.read(this.templatePath(`${PATH_PREFIX}/selector.ejs`));
    const newSelector = ejs.render(selectorTemplate, this.templateConfig);
    console.log(newSelector);
    // 3. add to file (new selector)
  }

  addSelectorTest() {
    // 1. select tests
    // 2. add to file (new selector test)
  }

  writing() {
    this.filesToWrite.forEach(({ name, content }) => this.fs.write(name, `${content.trim()}\n`));
  }
}
