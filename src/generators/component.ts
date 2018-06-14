import * as Generator from 'yeoman-generator'

import { Zwenerator, GeneratorOptions } from '../types';

const PATH_PREFIX = 'components';

class ActionGenerator extends Generator implements Zwenerator {
  options!: GeneratorOptions;
  topLevelPath!: string;
  filePath!: Array<string>;

  constructor(args: Array<string>, options : GeneratorOptions) {
    super(args, options);
    this.topLevelPath = `${this.options.srcDir}/${PATH_PREFIX}`;
    this.filePath = this.options.path.split('/').filterEmptyStrings();
    this.filePath.push(this.options.fileName);
  }
}

export = ActionGenerator;
