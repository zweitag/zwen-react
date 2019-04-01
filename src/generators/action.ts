import Generator from 'yeoman-generator'
import ejs from 'ejs';

import { Zwenerator, GeneratorOptions } from '../types';
import {
  addAlphabetically,
  extractFileParts,
} from '../utils';
import * as r from './templates/regex';
import * as t from './templates/templateStrings';

const PATH_PREFIX = 'actions';

class ActionGenerator extends Generator implements Zwenerator {
  topLevelPath!: string;
  destDir!: Array<string>;
  fileName!: string;
  path: string;
  withActionType: boolean = true;

  constructor(args: Array<string>, options : GeneratorOptions) {
    super(args, options);

    this.topLevelPath = `${options.srcDir}/${PATH_PREFIX}`;
    this.fileName = options.fileName;
    this.destDir = options.destDir;
    this.path = this.destDir.slice(0, -1).toString('/');
  }

  prompting() {
    return this.prompt({
      type: 'confirm',
      name: 'withActionType',
      message: 'Create an action type with the same name?'
    }).then(answer => {
      this.withActionType = answer.withActionType;
    });
  }

  updateExports() {
    let currentPath = `${this.topLevelPath}/`;

    this.destDir.forEach((subPath : string, index : number) => {
      const lastLevel = index === this.destDir.length - 1;
      const indexFile = this.fs.read(`${currentPath}/index.js`, { defaults: '' });
      const fileParts = extractFileParts(indexFile, r.exportAll);
      const newExport = lastLevel ? 'creators' : subPath;
      const updatedCreatorsFile = addAlphabetically(fileParts, t.exportAll(newExport));

      this.fs.write(`${currentPath}/index.js`, updatedCreatorsFile);

      if (this.withActionType && !lastLevel) {
        const typesFile = this.fs.read(`${currentPath}/types.js`, { defaults: '' });
        const typeFileParts = extractFileParts(typesFile, r.exportAll);
        const updatedTypesFile = addAlphabetically(typeFileParts, t.exportAll(`${subPath}/types`));
        this.fs.write(`${currentPath}/types.js`, updatedTypesFile);
      }

      currentPath += `${subPath}/`;
    });
  }

  createActionFile() {
    const destPath = `${this.topLevelPath}/${this.path}`;
    const creatorsFile = this.fs.read(`${destPath}/creators.js`, { defaults: t.importAllTypes() });
    const creatorTemplate = this.fs.read(this.templatePath(`${PATH_PREFIX}/creator.ejs`));

    const newCreator = ejs.render(
      creatorTemplate,
      {
        ACTION_NAME: this.fileName,
        ACTION_TYPE: 't.' + (this.withActionType ? this.fileName.toConstantCase() : 'ACTION_TYPE'),
      }
    ).removeNewLines();

    const fileParts = extractFileParts(creatorsFile, r.exportAction);
    const updatedFile = addAlphabetically(fileParts, newCreator, '\n\n', '\n\n');

    this.fs.write(`${destPath}/creators.js`, updatedFile);
  }

  createActionTest() {
    const destPath = `${this.topLevelPath}/${this.path}`;
    const fileDefaults = t.creatorTestFile(this.path);
    const defaultContent = fileDefaults.head + '\n' + fileDefaults.foot;
    const testFile = this.fs.read(`${destPath}/creators.test.js`, { defaults: defaultContent });

    const fileParts = extractFileParts(testFile, r.describeActionTest, r.combineEnd);

    const testTemplate = this.fs.read(this.templatePath(`${PATH_PREFIX}/creator.test.ejs`));
    const newTest = ejs.render(
      testTemplate,
      {
        ACTION_NAME: this.fileName,
        ACTION_TYPE: this.withActionType ? this.fileName.toConstantCase() : 'ACTION_TYPE',
      }
    ).removeNewLines();

    const updatedFile = addAlphabetically(fileParts, newTest, '\n', '\n\n');

    this.fs.write(`${destPath}/creators.test.js`, updatedFile);
  }

  createTypeFiles() {
    if (this.withActionType) {
      const destPath = `${this.topLevelPath}/${this.path}`;
      const typesFile = this.fs.read(`${destPath}/types.js`, { defaults: '' });
      const fileParts = extractFileParts(typesFile, r.exportType, r.doubleNewLine);
      const newType = t.exportType(this.fileName.toConstantCase(), this.path);
      const updatedTypesFile = addAlphabetically(fileParts, newType);

      this.fs.write(`${destPath}/types.js`, updatedTypesFile);
    }
  }
}

export default ActionGenerator;
