import Generator from 'yeoman-generator'

import { Zwenerator, GeneratorOptions } from '../types';

const PATH_PREFIX = 'components';

class ComponentGenerator extends Generator implements Zwenerator {
  topLevelPath!: string;
  destDir!: Array<string>;
  fileName!: string;
  path: string;
  classComp: boolean;
  connected: boolean = false;
  withProps: boolean = true;

  constructor(args: Array<string>, options : GeneratorOptions) {
    super(args, options);

    this.topLevelPath = `${options.srcDir}/${PATH_PREFIX}`;
    this.fileName = options.fileName;
    this.destDir = options.destDir;
    this.path = this.destDir.slice(0, -1).toString('/');
    this.classComp = options.classComp === true;
  }

  prompting() {
    return this.prompt({
      type: 'confirm',
      name: 'connected',
      message: 'Do you want the component to be connected to the store?'
    }).then(answer => {
      this.connected = answer.connected;

      if (!answer.connected) {
        return this.prompt({
          type: 'confirm',
          name: 'withProps',
          message: 'Do you want the component to be set up with props?'
        }).then(answer => {
          this.withProps = answer.withProps;
        });
      }
    });
  }

  writing() {
    const destPath = `${this.topLevelPath}/${this.path}`;
    const componentName = this.fileName.toPascalCase();
    const templateName = this.classComp ? 'classComp' : 'component';
    this.fs.copyTpl(
      this.templatePath(`${PATH_PREFIX}/${templateName}.ejs`),
      this.destinationPath(`${destPath}/${componentName}.js`),
      {
        COMPONENT_NAME: componentName,
        CONNECTED: this.connected,
        WITH_PROPS: this.withProps,
      }
    );
  }
}

export default ComponentGenerator;
