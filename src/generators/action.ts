import * as Generator from 'yeoman-generator'

import { Zwenerator, GeneratorOptions } from '../types';
import { addAlphabetically, pushSort } from '../utils';
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
    const exportPaths = this.filePath.slice(0, -1);

    exportPaths.forEach((subPath : string) => {
      const creatorsFile = this.fs.read(`${currentPath}/creators.js`, { defaults: '' });
      const updatedCreatorsFile = addAlphabetically(creatorsFile, t.exportAll(`${subPath}/creators`));
      this.fs.write(`${currentPath}/creators.js`, updatedCreatorsFile);

      if (this.withActionType) {
        const typesFile = this.fs.read(`${currentPath}/types.js`, { defaults: '' });
        const updatedTypesFile = addAlphabetically(typesFile, t.exportAll(`${subPath}/types`));
        this.fs.write(`${currentPath}/types.js`, updatedTypesFile);
      }

      currentPath += `${subPath}/`;
    });
  }

  createActionFiles() {
    const destPath = `${this.topLevelPath}/${this.options.path}`;
    const defaultLine = `import * as t from '@/actions/types';\n`;
    const creatorsFile = this.fs.read(`${destPath}/creators.js`, { defaults: defaultLine });

    this.fs.write(`${destPath}/creators.js`, creatorsFile);
  }
}

export = ActionGenerator;
