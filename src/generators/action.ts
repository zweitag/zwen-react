import ejs from 'ejs';
import Generator from 'yeoman-generator';

import { FileToWrite, GeneratorOptions, Zwenerator } from '../types';
import { addToFile } from '../utils';
import * as r from './constants/regex';
import * as t from './constants/templateStrings';

const PATH_PREFIX = 'actions';
const CREATORS_FILE_NAME = 'creators';

export default class ActionGenerator extends Generator implements Zwenerator {
  filesToWrite: FileToWrite[] = [];
  templateConfig: object = {};
  destDir: string[];
  topLevelPath: string;
  path: string;
  absolutePath: string;
  fileName: string;
  withActionType: boolean = true;

  constructor(args: string[], options: GeneratorOptions) {
    super(args, options);

    // TODO: remove this line as soon as file name is no longer added to destDir
    this.destDir = options.destDir.slice(0, -1);
    // this.destDir = options.destDir;
    this.topLevelPath = `${options.srcDir}/${PATH_PREFIX}`;
    this.path = this.destDir.toString('/');
    this.absolutePath = `${this.topLevelPath}/${this.path}`;
    this.fileName = options.fileName;
  }

  async prompting() {
    const answer = await this.prompt({
      message: 'Create an action type with the same name?',
      name: 'withActionType',
      type: 'confirm',
    });

    this.withActionType = answer.withActionType;
  }

  configuring() {
    this.templateConfig = {
      ACTION_NAME: this.fileName,
      ACTION_TYPE: 't.' + (this.withActionType ? this.fileName.toConstantCase() : 'ACTION_TYPE'),
    };
  }

  addExports() {
    const destDirWithCreators = this.destDir.concat(CREATORS_FILE_NAME);
    let currentPath = `${this.topLevelPath}/`;

    destDirWithCreators.forEach((subPath: string, index: number) => {
      const isLastLevel = index === destDirWithCreators.length - 1;
      const newCreatorExport = t.exportAllFrom(subPath);

      // read
      const indexFile = this.fs.read(`${currentPath}/index.js`, { defaults: '' });
      // update
      const updatedIndexFile = addToFile(indexFile, newCreatorExport, r.selectAllExports);
      // write
      this.filesToWrite.push({ name: `${currentPath}/index.js`, content: updatedIndexFile });

      if (this.withActionType && !isLastLevel) {
        const newTypesExport = t.exportAllFrom(`${subPath}/types`);

        // read
        const typesFile = this.fs.read(`${currentPath}/types.js`, { defaults: '' });
        // update
        const updatedTypesFile = addToFile(typesFile, newTypesExport, r.selectAllExports);
        // write
        this.filesToWrite.push({ name: `${currentPath}/types.js`, content: updatedTypesFile });
      }

      currentPath += `${subPath}/`;
    });
  }

  addActionCreator() {
    const importStatement = t.importAllAsFrom('t', '@/actions/types') + '\n';
    const creatorTemplate = this.fs.read(this.templatePath(`${PATH_PREFIX}/creator.ejs`));
    const newCreator = ejs.render(creatorTemplate, this.templateConfig);

    // read
    const creatorsFile = this.fs.read(`${this.absolutePath}/creators.js`, { defaults: importStatement });
    // update
    const updatedFile = addToFile(creatorsFile, newCreator, r.selectAllExports, '\n\n');
    // write
    this.filesToWrite.push({ name: `${this.absolutePath}/creators.js`, content: updatedFile });
  }

  addActionCreatorTest() {
    const testTemplate = this.fs.read(this.templatePath(`${PATH_PREFIX}/creator.test.ejs`));
    const newTest = ejs.render(testTemplate, this.templateConfig);

    // read
    const testFile = this.fs.read(`${this.absolutePath}/creators.test.js`, { defaults: t.creatorTestHead(this.path) });
    // update
    const updatedFile = addToFile(testFile, newTest, r.selectAllDescribes, '\n\n  ', t.creatorTestFoot(), '  ');
    // write
    this.filesToWrite.push({ name: `${this.absolutePath}/creators.test.js`, content: updatedFile });
  }

  addActionType() {
    if (this.withActionType) {
      const actionType = this.fileName.toConstantCase();
      const newExport = t.exportStringConst(actionType, `${this.path}/${actionType}`);

      // read
      const typesFile = this.fs.read(`${this.absolutePath}/types.js`, { defaults: '' });
      // update
      const updatedFile = addToFile(typesFile, newExport, r.selectAllExports);
      // write
      this.filesToWrite.push({ name: `${this.absolutePath}/types.js`, content: updatedFile });
    }
  }

  writing() {
    this.filesToWrite.forEach(({ name, content }) => this.fs.write(name, content));
  }
}
