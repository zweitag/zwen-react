import Generator from 'yeoman-generator';

export interface Flags {
  version: string;
  v: boolean;
  help: string;
  h: boolean;
  classComp: string;
  c: boolean;
}

export interface GeneratorOptions {
  destDir: string[];
  fileName: string;
  srcDir: string;
  classComp?: boolean;
}

export interface FileToWrite {
  name: string;
  content: string;
}

export interface Zwenerator extends Generator {
  filesToWrite: FileToWrite[];
  destDir: string[];
  fileName: string;
  topLevelPath: string;
}

export interface FileParts {
  before: string;
  extracts: string[];
  after: string;
}
