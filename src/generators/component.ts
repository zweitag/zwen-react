import * as Generator from 'yeoman-generator'

import { Zwenerator, GeneratorOptions } from '../types';

const PATH_PREFIX = 'components';

class ComponentGenerator extends Generator implements Zwenerator {
  options!: GeneratorOptions;
  topLevelPath!: string;
  filePath!: Array<string>;
  connected: boolean = false;
  withProps: boolean = true;

  constructor(args: Array<string>, options : GeneratorOptions) {
    super(args, options);

    this.option('classComp', {
      description: 'Will create a class component where you can use React\'s lifecycle methods.',
      alias: '-c',
    });

    this.topLevelPath = `${this.options.srcDir}/${PATH_PREFIX}`;
    this.filePath = this.options.path.split('/').filterEmptyStrings();
    this.filePath.push(this.options.fileName);
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
    const destPath = `${this.topLevelPath}/${this.options.path}`;
    const componentName = this.options.fileName.toPascalCase();
    const templateName = this.options.classComp ? 'classComp' : 'component';
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
