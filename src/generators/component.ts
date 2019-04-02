import Generator from 'yeoman-generator';

import { GeneratorOptions, Zwenerator } from '../types';

const PATH_PREFIX = 'components';

export default class ComponentGenerator extends Generator implements Zwenerator {
  topLevelPath!: string;
  destDir!: string[];
  fileName!: string;
  path: string;
  classComp: boolean;
  connected: boolean = false;
  withProps: boolean = true;

  constructor(args: string[], options: GeneratorOptions) {
    super(args, options);

    this.topLevelPath = `${options.srcDir}/${PATH_PREFIX}`;
    this.fileName = options.fileName;
    this.destDir = options.destDir;
    this.path = this.destDir.slice(0, -1).toString('/');
    this.classComp = options.classComp === true;
  }

  async prompting() {
    const answer1 = await this.prompt({
      message: 'Do you want the component to be connected to the store?',
      name: 'connected',
      type: 'confirm',
    });

    this.connected = answer1.connected;

    if (!answer1.connected) {
      const answer2 = await this.prompt({
        message: 'Do you want the component to be set up with props?',
        name: 'withProps',
        type: 'confirm',
      });

      this.withProps = answer2.withProps;
    }
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
      },
    );
  }
}
