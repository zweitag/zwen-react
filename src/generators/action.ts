import * as Generator from 'yeoman-generator'
import * as ejs from 'ejs';

import { Zwenerator, GeneratorOptions } from '../types';
import {
  addAlphabetically,
  addAlphabeticallyAsArray,
  pushSort,
  splitAt,
} from '../utils';
import * as t from './templates/templateStrings';

const PATH_PREFIX = 'actions';

class ActionGenerator extends Generator implements Zwenerator {
  options!: GeneratorOptions;
  topLevelPath!: string;
  filePath!: Array<string>;
  withActionType: boolean = true;

  constructor(args: Array<string>, options : GeneratorOptions) {
    super(args, options);
    this.topLevelPath = `${this.options.srcDir}/${PATH_PREFIX}`;
    this.filePath = this.options.path.split('/').filter(p => p !== '');
    this.filePath.push(this.options.fileName);
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

    this.filePath.forEach((subPath : string, index : number) => {
      const lastLevel = index === this.filePath.length - 1;
      const creatorsFile = this.fs.read(`${currentPath}/index.js`, { defaults: '' });
      const newExport = lastLevel ? 'creators' : subPath;
      const updatedCreatorsFile = addAlphabetically(creatorsFile, t.exportAll(`${newExport}`)).trim();
      this.fs.write(`${currentPath}/index.js`, updatedCreatorsFile + '\n');

      if (this.withActionType && !lastLevel) {
        const typesFile = this.fs.read(`${currentPath}/types.js`, { defaults: '' });
        const updatedTypesFile = addAlphabetically(typesFile, t.exportAll(`${subPath}/types`)).trim();
        this.fs.write(`${currentPath}/types.js`, updatedTypesFile + '\n');
      }

      currentPath += `${subPath}/`;
    });
  }

  createActionFile() {
    const destPath = `${this.topLevelPath}/${this.options.path}`;
    const defaultLine = `${t.importAllTypes()}\n\n`;
    const creatorsFile = this.fs.read(`${destPath}/creators.js`, { defaults: defaultLine });
    const creatorTemplate = this.fs.read(this.templatePath(`${PATH_PREFIX}/creator.ejs`));

    const newCreator = ejs.render(
      creatorTemplate,
      {
        ACTION_NAME: this.options.fileName,
        ACTION_TYPE: 't.' + (this.withActionType ? this.options.fileName.toUpperCase() : 'ACTION_TYPE'),
      }
    ).trim();

    let updatedFile = '';
    const fileArray = creatorsFile.split('\n\n');
    const firstExportIndex = fileArray.findIndex((val : string) =>/export const/.test(val));

    if (firstExportIndex === -1) {
      updatedFile = creatorsFile + newCreator;

    } else {
      const creatorsArray = fileArray.splice(firstExportIndex).map(line => line.trim());
      const updatedFileArray = fileArray.concat(addAlphabeticallyAsArray(creatorsArray, newCreator, false));
      updatedFile = updatedFileArray.join('\n\n');
    }

    this.fs.write(`${destPath}/creators.js`, updatedFile + '\n');
  }

  createActionTest() {
    const destPath = `${this.topLevelPath}/${this.options.path}`;
    const testFile = this.fs.read(`${destPath}/creators.test.js`, { defaults: '' });
    const firstTestIndex = testFile.indexOf(`\n  describe(`)
    let extractedTests = splitAt(testFile, firstTestIndex);
    const endIndex = extractedTests.lastIndexOf(`});`);
    extractedTests = splitAt(extractedTests, endIndex);

    const testTemplate = this.fs.read(this.templatePath(`${PATH_PREFIX}/creator.test.ejs`));

    const newTest = ejs.render(
      testTemplate,
      {
        ACTION_NAME: this.options.fileName,
        ACTION_TYPE: 't.' + (this.withActionType ? this.options.fileName.toUpperCase() : 'ACTION_TYPE'),
      }
    ).trim();

    console.log(extractedTests + '\n' + newTest);

  }

  createTypeFiles() {
    if (this.withActionType) {
      const destPath = `${this.topLevelPath}/${this.options.path}`;
      const typesFile = this.fs.read(`${destPath}/types.js`, { defaults: '' });
      const newType = t.exportType(this.options.fileName.toUpperCase(), this.options.path);
      const updatedTypesFile = addAlphabetically(typesFile, newType);

      this.fs.write(`${destPath}/types.js`, updatedTypesFile);
    }
  }
}

export = ActionGenerator;
