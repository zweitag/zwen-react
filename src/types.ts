import * as Generator from 'yeoman-generator'

export interface GeneratorOptions {
  path: string,
  fileName: string,
  srcDir: string,
}

export interface Zwenerator extends Generator {
  filePath: Array<string>,
  topLevelPath: string,
}
