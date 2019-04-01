import Generator from 'yeoman-generator'

export interface Flags {
  version: string,
  v: boolean,
  help: string,
  h: boolean,
  classComp: string,
  c: boolean,
}

export interface GeneratorOptions {
  destDir: Array<string>,
  fileName: string,
  srcDir: string,
  classComp?: boolean,
}

export interface Zwenerator extends Generator {
  destDir: Array<string>,
  fileName: string,
  topLevelPath: string,
}

export interface fileParts {
  before : string,
  extracts : string[],
  after : string,
}
