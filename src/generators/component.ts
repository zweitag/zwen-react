import Generator from 'yeoman-generator';

import { GeneratorOptions, Zwenerator } from '../types';

const PATH_PREFIX = 'components';

export default class ComponentGenerator extends Generator implements Zwenerator {
  templateConfig: object = {};
  destDir: string[];
  destPath: string;
  topLevelPath: string;
  absolutePath: string;
  fileName: string;
  classComp: boolean;
  connected: boolean = false;
  withProps: boolean = true;

  constructor(args: string[], options: GeneratorOptions) {
    super(args, options);

    this.destDir = options.destDir;
    this.destPath = this.destDir.join('/');
    this.topLevelPath = `${options.srcDir}/${PATH_PREFIX}`;
    this.absolutePath = `${this.topLevelPath}/${this.destPath}`;
    this.fileName = options.fileName;
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

  configuring() {
    this.templateConfig = {
      COMPONENT_NAME: this.fileName.toPascalCase(),
      CONNECTED: this.connected,
      WITH_PROPS: this.withProps,
    };
  }

  writing() {
    const destPath = `${this.absolutePath}`;
    const templateName = this.classComp ? 'classComp' : 'component';
    const componentName = this.fileName.toPascalCase();
    this.fs.copyTpl(
      this.templatePath(`${PATH_PREFIX}/${templateName}.ejs`),
      this.destinationPath(`${this.absolutePath}/${componentName}.js`),
      this.templateConfig,
    );
  }
}
