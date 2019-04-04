import Generator from 'yeoman-generator';

export interface AdditionOptions {
  appendixIfNew?: string;           // add something at the end of a new file
  prefixForAll?: string;            // add indentation
  replaceStringSeparator?: string;  // see above, use with RegEx lookarounds
  separator?: string;               // argument given to join
  suffixForAll?: string;            // combine with an empty separator to join all with
                                    // the suffix and additionally append it to the end.
}

export interface FileParts {
  before: string;
  extracts: string[];
  after: string;
}

export interface FileToWrite {
  name: string;
  content: string;
}

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

export interface Zwenerator extends Generator {
  filesToWrite?: FileToWrite[];
  destDir: string[];          // path elements leading from enclosing dir to the file
  destPath: string;           // path leading from enclosing dir to target directory
  topLevelPath: string;       // path leading to the enclosing directory
  absolutePath: string;       // path combination of topLevelPath and destPath
  fileName: string;
}
