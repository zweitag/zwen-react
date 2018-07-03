import * as Generator from 'yeoman-generator'

export interface GeneratorOptions {
  path: string,
  fileName: string,
  srcDir: string,
  classComp?: boolean,
}

export interface Zwenerator extends Generator {
  filePath: Array<string>,
  topLevelPath: string,
}

export interface fileParts {
  before : string,
  extracts : string[],
  after : string,
}
